$(document).ready(function() {
    $("#add_item").submit(handleAddItem);
    $("#edit_item").submit(function() {
        return false;
    });
    $("#shopping_list").on("click", "input[type=checkbox]", handleCheckboxClick);
    $("#shopping_list").on("click", "li", handleItemClick);
    $("#shopping_list").on("dblclick", "li", handleItemDblClick);
    $("#shopping_list").on("focusout", "input[type=text]", handleEditItem);
    $("#shopping_list").on("keypress", "input[type=text]", function(event) {
        // Save changes when enter key is pressed
        if (event.keyCode == 13) {
            handleEditItem.call(this);
        }
    });
    $("#toggle_all_btn").click(handleToggleAllClick);
    $("#complete_btn").click(handleCompleteClick);
});

function handleAddItem() {
    var item = $("#item");
    var value = item.val().trim();
    var shoppping_list = $("#shopping_list");

    console.log("Adding " + value + "...");
    var new_item = $(
        "<li>" +
        "<input type=\"checkbox\" value=\"" + value + "\">" +
        "<input type=\"text\" value=\"" + value + "\">" +
        "<span>" + value + "</span>" +
        "</li>");
    new_item.appendTo("#shopping_list");
    new_item.slideDown();

    // Clear item so that next value is written easily
    item.val("");

    updateItemCount();
    updateToggleAllButton();

    // Never send form to the server
    return false;
}

function updateItemCount() {
    var item_count = $("#shopping_list li").length;
    console.log("Items: " + item_count);
    $("#item_count").text(item_count);

    var shopping_list = $("#shopping_list");
    if (item_count > 0) {
        shopping_list.show();
    } else {
        shopping_list.hide();
    }
}

function updateSelectedItemCount() {
    var selected_items = $("#selected_items_info");
    var selected_count = $("#shopping_list input[type=checkbox]:checked").length;
    console.log("Selected items: " + selected_count);
    $("#selected_items_count").text(selected_count);
    if (selected_count > 0) {
        selected_items.show();
    } else {
        selected_items.hide();
    }

    $("#complete_btn").prop("disabled", selected_count === 0);
}

function updateToggleAllButton() {
    var toggle_all = $("#toggle_all_btn");
    var item_count = $("#shopping_list input[type=checkbox]").length;
    var selected_count = $("#shopping_list input[type=checkbox]:checked").length;

    toggle_all.prop("disabled", item_count === 0);

    if (item_count > 0 && item_count == selected_count) {
        toggle_all.val("Deselect all");
    } else {
        toggle_all.val("Select all");
    }
}

function handleCheckboxClick(event) {
    var input = $(this);
    console.log("Toggled " + input.val());

    updateSelectedItemCount();
    updateToggleAllButton();
}

function handleItemClick(event) {
    // Avoid handling input click events twice when they bubble up
    if (!$(event.target).is("li")) {
            return;
    }

    $(this).find("input[type=checkbox]").click();
}

function handleItemDblClick(event) {
    var input = $(this).find("input[type=text]");
    var span = $(this).find("span");

    span.hide();
    input.show().focus();
}

function handleToggleAllClick() {
    var inputs = $("#shopping_list input");
    if ($(this).val() == "Select all") {
        inputs = inputs.filter(":not(:checked)");
    } else {
        inputs = inputs.filter(":checked");
    }
    inputs.click();
}

function handleCompleteClick() {
    var items = $("#shopping_list input:checked").parent();
    items.slideUp(function() {
        $(this).remove();
        updateItemCount();
        updateSelectedItemCount();
        updateToggleAllButton();
    });
}

function handleEditItem() {
    var input = $(this);
    var span = input.siblings("span");

    input.hide();
    span.text(input.val());
    console.log("New item value: " + input.val());
    span.show();
}
