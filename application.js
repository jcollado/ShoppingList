$(document).ready(function() {
    $("form").submit(handleSubmit);
    $("#shopping_list").on("click", "input", handleItemClick);
    $("#toggle_all_btn").click(handleToggleAllClick);
    $("#complete_btn").click(handleCompleteClick);
});

function handleSubmit() {
    var item = $("#item");
    var shoppping_list = $("#shopping_list");

    console.log("Adding " + item.val() + "...");
    var new_item = $(
        "<li>" +
        "<input type=\"checkbox\" value=\"" + item.val() + "\">" +
        item.val() +
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
    var selected_count = $("#shopping_list input:checked").length;
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
    var item_count = $("#shopping_list input").length;
    var selected_count = $("#shopping_list input:checked").length;

    toggle_all.prop("disabled", item_count === 0);

    if (item_count > 0 && item_count == selected_count) {
        toggle_all.val("Deselect all");
    } else {
        toggle_all.val("Select all");
    }
}

function handleItemClick() {
    var input = $(this);
    console.log("Toggled " + input.val());

    updateSelectedItemCount();
    updateToggleAllButton();
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
    console.log(items);
    items.slideUp(function() {
        $(this).remove();
        updateItemCount();
        updateSelectedItemCount();
        updateToggleAllButton();
    });
}
