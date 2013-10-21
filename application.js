$(document).ready(function() {
    $("form").submit(handleSubmit);
    $("#shopping_list").on("click", "input", handleItemClick);
    $("#toggle_all").click(handleToggleAllClick);
    $("#complete").click(handleCompleteClick);
});

function handleSubmit() {
    var item = $("#item");
    var shoppping_list = $("#shopping_list");

    console.log("Adding " + item.val() + "...");
    $("#shopping_list").append(
            "<li>" +
            "<input type=\"checkbox\" value=\"" + item.val() + "\">" +
            item.val() +
            "</li>");

    // Clear item so that next value is written easily
    item.val("");

    updateItemCount();

    // Never send form to the server
    return false;
}

function updateItemCount() {
    var item_count = $("#shopping_list li").length;
    console.log("Items: " + item_count);
    $("#item_count").text(item_count);
}

function handleItemClick() {
    var input = $(this);
    console.log("Toggled " + input.val());

    // Display number of selected items
    var selected_items = $("#selected_items_info");
    var selected_count = $("#shopping_list input:checked").length;
    console.log("Selected items: " + selected_count);
    $("#selected_items_count").text(selected_count);
    if (selected_count > 0) {
        selected_items.show();
    } else {
        selected_items.hide();
    }

    // Update select/deselect all button
    var toggle_all = $("#toggle_all");
    var item_count = $("#shopping_list input").length;
    if (item_count == selected_count) {
        toggle_all.val("Deselect all");
    } else {
        toggle_all.val("Select all");
    }

}

function handleToggleAllClick() {
    var inputs = $("#shopping_list input");

    // Click on *not* selected items
    function select(index, element) {
        var e = $(element);
        if (!e.is(":checked")) {
            e.click();
        }
    }

    // Click on selected items
    function deselect(index, element) {
        var e = $(element);
        if (e.is(":checked")) {
            e.click();
        }
    }

    if ($(this).val() == "Select all") {
        inputs.each(select);
    } else {
        inputs.each(deselect);
    }

    return false;
}

function handleCompleteClick() {
    var inputs = $("#shopping_list input:checked");

    // Remove selected items
    inputs.each(function(index, element) {
        var e = $(element);
        e.parent().remove();
    });

    return false;
}
