$(document).ready(function() {
    $("#add_item").submit(handleAddItem);

    $("#edit_item").submit(function() {
        // Edit form is used to edit shopping list values,
        // but the form itself should never be submitted
        return false;
    });

    var shopping_list = $("#shopping_list");
    shopping_list.sortable();

    // Checkbox is toggled both when the checkbox itself is clicked
    // and also when the parent <li> element is clicked
    shopping_list.on("click", "input[type=checkbox]", handleCheckboxClick);
    shopping_list.on("click", "li", handleItemClick);
    shopping_list.on("mouseenter mouseleave", "li", function() {
        $(this).find("a").toggle();
    });
    shopping_list.on("click", "a", function(event) {
        handleEditItemStart.call($(this).parent());

        // Don't bubble up the event to the enclosing <li> element
        event.stopPropagation();
    });


    // When the <li> element is double clicked, the input text box
    // is displayed to let the user edit the item
    shopping_list.on("dblclick", "li", handleEditItemStart);

    // When the input text box is focused out or when the enter key is pressed
    // the edition is finished and the span element is displayed again
    shopping_list.on("focusout", "input[type=text]", handleEditItemStop);
    shopping_list.on("keypress", "input[type=text]", function(event) {
        // Save changes when enter key is pressed
        if (event.which == 13) {
            $(this).focusout();
        }
    });
    $("#toggle_all_btn").click(handleToggleAllClick);
    $("#complete_btn").click(handleCompleteClick);
});

// Add item to shopping list
// A span and an input text box is used to make sure the item
// can be edited in the future
function handleAddItem() {
    var item = $("#item");
    var value = item.val().trim();
    var error = $("#error").hide();

    if (value === "") {
        console.log('hola');
        error.find("span").text("Please enter a non-empty value");
        error.show();
        return false;
    }

    console.log("Adding " + value + "...");
    var new_item = $(
        "<li>" +
        "<input type=\"checkbox\" value=\"" + value + "\">" +
        "<input type=\"text\" value=\"" + value + "\">" +
        "<span>" + value + "</span>" +
        "<a href=\"#\">Edit</a> " +
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

// Update item count
// This is called as a side effect after:
// - an item is added
// - some items have been marked as complete
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

// Update selected item count
// This is called as a side effect after:
// - an item is selected
// - some items have been marked as complete
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

// Update toggle all button text (select/deselect all)
// depending on the number of items selected
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

// Make sure application state is update when an item is selected
function handleCheckboxClick(event) {
    var input = $(this);
    console.log("Toggled " + input.val());

    updateSelectedItemCount();
    updateToggleAllButton();

    // Don't bubble up the event to the enclosing <li> element
    event.stopPropagation();
}

// When <li> element is clicked, behave as if <input type="checkbox"> is clicked
function handleItemClick(event) {
    $(this).find("input[type=checkbox]").click();
}

// Select/Deselect all when button is clicked
function handleToggleAllClick() {
    var inputs = $("#shopping_list input[type=checkbox]");
    if ($(this).val() == "Select all") {
        inputs = inputs.filter(":not(:checked)");
    } else {
        inputs = inputs.filter(":checked");
    }
    inputs.click();
}

// Remove selected items when complete button is clicked
function handleCompleteClick() {
    var items = $("#shopping_list input:checked").parent();
    items.slideUp(function() {
        $(this).remove();
        updateItemCount();
        updateSelectedItemCount();
        updateToggleAllButton();
    });
}

// Start item edition by hiding span and showing input text box
function handleEditItemStart(event) {
    var input = $(this).find("input[type=text]");
    var span = $(this).find("span");

    span.hide();
    input.show().focus();
}

// End item edition by hiding text box and showing span with updated value
function handleEditItemStop() {
    var input = $(this);
    var span = input.siblings("span");

    input.hide();
    span.text(input.val());
    console.log("New item value: " + input.val());
    span.show();
}
