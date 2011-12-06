// Discussion Canvas jQuery plugin
//
// Author: Anson MacKeracher
// Date: June 21, 2001
//
// Layer between Raphael and the Discussion module's canvas

(function($) {
    var methods = {
        "show" : function() { 
            settings["hidden"] = false;
        },
        "hide" : function() { 
            settings["hidden"] = true;
        },
        "init" : function(options) { 
            // Respect chaining
            return this.each(function() {
                if(options) {
                    $.extend(settings, options);
                }

                var wrapper = $("<div></div>");

                // Create canvas controls
                var html = "<div style='display:inline'><p style='display:inline'>Colors:</p>";
                html += "<a id='canvas_red' class='canvas_color' href='#'><img src='" + options.image_path + "red.png' /></a>";
                html += "<a id='canvas_purple' class='canvas_color' href='#'><img src='" + options.image_path + "purple.png' /></a>";
                html += "<a id='canvas_green' class='canvas_color' href='#'><img src='" + options.image_path + "green.png' /></a>";
                html += "<a id='canvas_blue' class='canvas_color' href='#'><img src='" + options.image_path + "blue.png' /></a>";
                html += "<a id='canvas_black' class='canvas_color' href='#'><img src='" + options.image_path + "black.png' /></a>";
                html += "<a id='canvas_eraser' class='canvas_color' href='#'><img src='" + options.image_path + "eraser.png' /></a>";
                html += "</div>";
                html += "<div style='display:inline'><p style='display:inline'>Sizes</p>";
                html += "<a id='canvas_size_small' href='#'><img src='" + options.image_path + "pen.png' style='width:10px;' /></a>";
                html += "<a id='canvas_size_medium' href='#'><img src='" + options.image_path + "pen.png' style='width:15px;'/></a>";
                html += "<a id='canvas_size_large' href='#'><img src='" + options.image_path + "pen.png' style='width:20px'/></a>";
                html += "<a id='canvas_clear' style='float:right; margin-top:10px;' href='#'>Clear canvas</a>";
                var html_el = $(html)

                // Initialize the control logic
                html_el.find("a#canvas_red").click(function(event) {
                    event.preventDefault() 
                    state.color = colors.red;
                    $(this).find("img").addClass("color_selected");
                    state.selected_color.find("img").removeClass("color_selected");
                    state.selected_color = $(this);
                });
                html_el.find("a#canvas_purple").click(function(event) {
                    event.preventDefault() 
                    state.color = colors.purple;
                    $(this).find("img").addClass("color_selected");
                    state.selected_color.find("img").removeClass("color_selected");
                    state.selected_color = $(this);
                });
                html_el.find("a#canvas_green").click(function(event) {
                    event.preventDefault() 
                    state.color = colors.green;
                    $(this).find("img").addClass("color_selected");
                    state.selected_color.find("img").removeClass("color_selected");
                    state.selected_color = $(this);
                });
                html_el.find("a#canvas_blue").click(function(event) {
                    event.preventDefault() 
                    state.color = colors.blue;
                    $(this).find("img").addClass("color_selected");
                    state.selected_color.find("img").removeClass("color_selected");
                    state.selected_color = $(this);
                });
                html_el.find("a#canvas_black").click(function(event) {
                    event.preventDefault() 
                    state.color = colors.black;
                    $(this).find("img").addClass("color_selected");
                    state.selected_color.find("img").removeClass("color_selected");
                    state.selected_color = $(this);
                });
                html_el.find("a#canvas_eraser").click(function(event) {
                    event.preventDefault() 
                    state.color = colors.white;
                    $(this).find("img").addClass("color_selected");
                    state.selected_color.find("img").removeClass("color_selected");
                    state.selected_color = $(this);
                });
                html_el.find("a#canvas_size_small").click(function(event) {
                    event.preventDefault() 
                    state.size = sizes.small;
                    $(this).find("img").addClass("color_selected");
                    state.selected_size.find("img").removeClass("color_selected");
                    state.selected_size= $(this);
                });
                html_el.find("a#canvas_size_medium").click(function(event) {
                    event.preventDefault() 
                    state.size = sizes.medium;
                    $(this).find("img").addClass("color_selected");
                    state.selected_size.find("img").removeClass("color_selected");
                    state.selected_size= $(this);
                });
                html_el.find("a#canvas_size_large").click(function(event) {
                    event.preventDefault() 
                    state.size = sizes.large;
                    $(this).find("img").addClass("color_selected");
                    state.selected_size.find("img").removeClass("color_selected");
                    state.selected_size = $(this);
                });
                html_el.find("a#canvas_clear").click(function(event) {
                    event.preventDefault() 
                    canvas_params.canvas[0].width = canvas_params.canvas[0].width;
                });

                wrapper.append(html_el);

                // Create canvas element
                var canvas_el = $("<canvas style='border: 1px solid black;' width='465' height='320'><canvas>");
                canvas_params.canvas = canvas_el;
                canvas_params.context = canvas_el[0].getContext("2d");
                canvas_params.width = 465;
                canvas_params.height = 320;
                wrapper.append(canvas_el);

                // Bind mouse events on the canvas element
                canvas_el.mousedown(function(ev) {
                    c = get_canvas_coords(ev);
                    start_painting(c.x, c.y);
                });

                canvas_el.mousemove(function(ev) {
                    if (state.paint) {
                        c = get_canvas_coords(ev);
                        add_click(c.x, c.y)
                    }
                });

                canvas_el.mouseup(function(ev) {
                    c = get_canvas_coords(ev);
                    stop_painting(c.x, c.y);
                });

                canvas_el.mouseleave(function(ev) {
                    c = get_canvas_coords(ev)
                    stop_painting(c.x, c.y);
                });

                $(this).append(wrapper);
            });
        },
        "get_data": function() {
            if (state.started) {
                return canvas_params.canvas[0].toDataURL("image/png");
            } else {
                return "";
            }
        },
        "clear": function() {
            canvas_params.context.clearRect(0, 0, canvas_params.width, canvas_params.height);
        }
    };

    var get_canvas_coords = function(e) {
        var offset = canvas_params.canvas.offset();
        var mouse_x = e.pageX - offset.left;
        var mouse_y = e.pageY - offset.top;
        return {
            x: mouse_x,
            y: mouse_y
        };
    }
    
    var start_painting = function(x, y) {
        state.paint = true; // Change paint state to true
        state.started = true; // Change started state to tru

        // Draw stroke
        canvas_params.context.strokeStyle = state.color;
        canvas_params.context.lineWidth = state.size;
        canvas_params.context.beginPath();
        canvas_params.context.moveTo(x, y);
    };

    var stop_painting = function(x, y) {
        if (state.paint) {
            add_click(x, y);
            state.paint = false;
        }
    };

    var add_click = function(x, y, dragging) {
        canvas_params.context.lineTo(x, y);
        canvas_params.context.stroke();
    };

    var colors = {
        purple: "#c986c5",
        green: "#80c23e",
        yellow: "#ffcf33",
        red: "#f75e4f",
        white: "#ffffff",
        black: "#000000",
        blue: "#4bb0e0"
    };

    var sizes = {
        small: 2,
        medium: 7,
        large: 20
    }

    var settings = {
        hidden: false,
        image_path: "../../images/edumacation/discussion/"
    };

    var canvas_params = {
        canvas: undefined,
        context: undefined,
        width: 0,
        heigh: 0,
    };

    var state = {
        paint: false,
        color: colors.black,
        size: sizes.medium,
        selected_size: $(""),
        selected_color: $(""),
        mouse_down: false,
        started: false
    };

    $.fn.disc_canvas = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === "object" || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error("Method " + method + " does not exist on jQuery.disc_method!");
        }
    };
})(jQuery);


