/********************
    Interactive Form
    By Jonathon Cisneros
********************/
/***
    Variables
***/
const $colorDiv = $('.colorDiv');
const $colors = $('#color option');
const $activities = $('.activities');
const $option = $('.activities label input');
const $creditCardSection = $('#credit-card');
const $paypalSection = $('#paypal');
const $bitcoinSection = $('#bitcoin');

/***
    Calls necessary functions on load
***/
$(document).ready( function () {
    $('input').first().focus(); //Sets focus to first input
    $colorDiv.hide(); // Hides color options on load
    $paypalSection.hide(); // Hides paypal section on load
    $bitcoinSection.hide(); // Hides bitcoin section on load
});


/***
    ”Job Role”
    Hides "other" input
    Shows when "Other" is selected
***/
$('#other-title').hide(); // Hides "Other" input on load

$('#title').change( function () {
    if ($(this).val() == 'other')
        $('#other-title').show();
    else
        $('#other-title').hide();
}); // End $('#title').change()

// Pushes pun "colors" to puns array
let puns = [];
for (let i = 0; i <= 2; i++) {
    puns.push($colors[i].outerHTML);
}

// Pushes heart "colors" to heart array
let heart = [];
for (let i = 3; i <= 5; i++) {
    heart.push($colors[i].outerHTML);
}

/***
    ”T-Shirt Info”
    Matches t-shirt "color" to "theme"
***/
$('#design').change( function () {
    // Shows color options when valid option is selected
    $colorDiv.show();

    // Hides color options
    $('#color').children('option').remove();

    // Hides color options
    if ($(this).val() == 'select theme')
        $colorDiv.hide();

    // Shows "js puns only" colors
    if ($(this).val() == 'js puns')
        $('#color').append(puns);

    // Shows "heart js only" colors
    if ($(this).val() == 'heart js')
        $('#color').append(heart);
}); // End $('#design').change()

/***
    ”Register for Activities”
    Does not allow user to select a workshop that
    interferes with selected workhop.
    Adds total of checked activities.
***/
$('.activities').change( function (e) {
    // Retrieves created total from previous changes
    const oldTotal = document.querySelector('.activities p');

    // Clears total when a change occurs
    if (oldTotal)
        $activities[0].removeChild(oldTotal);

    // Returns checked activity
    function firstCheckbox (target) {
        for (let i = 0; i < $option.length; i++) {
            if (target === $option[i])
                return i;
         }
    }

    // Returns activity which interferes with checked activity
    function secondCheckbox (firstCheckbox) {
        if (firstCheckbox === 1)
            return 3;
        else if (firstCheckbox === 2)
            return 4;
        else if (firstCheckbox === 3)
            return 1;
        else if (firstCheckbox === 4)
            return 2;
    }

    // Checks activites
    function checkOption (first, second) {
        if ($option[first].checked)
            $option[second].disabled = true;
        else
            $option[second].disabled = false;
    }

    // Calls checkOption() to check for interfering activites
    if (e.target === $option[1] ||
        e.target === $option[2] ||
        e.target === $option[3] ||
        e.target === $option[4] )
        checkOption(firstCheckbox(e.target),
                                secondCheckbox(firstCheckbox(e.target)));

    // Sums up total of checked activites
    let total = 0;
    if ($option[0].checked)
        total += 200;

    for (let i = 1; i < $option.length; i++) {
        if ($option[i].checked)
            total += 100;
     }

     if (total) {
         const getTotal = document.createElement('p');
         getTotal.innerHTML = 'Total: $' + total;
         $activities[0].appendChild(getTotal);
     }
}); // End $('.activites').change()


/***
    ”Payment Info”
    Only displays selected payment option
***/
$('#payment').change( function () {
    // Shows credit card section
    if ($(this).val() === 'credit card') {
        $creditCardSection.show();
        $bitcoinSection.hide();
        $paypalSection.hide();
    }

    // Shows paypal information
    if ($(this).val() === 'paypal') {
        $paypalSection.show();
        $creditCardSection.hide();
        $bitcoinSection.hide();
    }

    // Shows bitcoin information
    if ($(this).val() === 'bitcoin') {
        $bitcoinSection.show();
        $creditCardSection.hide();
        $paypalSection.hide();
    }
}); // End $('#payment').change()

/***
    Form Validation

***/
$('form').submit( function (e) {
    const $name = $('#name').val();
    const $email = $('#mail').val();
    const $payment = $('#payment').val();

    // Checks if name is entered
    if (!$name) {
        e.preventDefault();
        $('.nameErrorText').text('Please enter name');
        $('#name').addClass('inputError');
    }

    // Validates email
    if (!isValidEmail($email)) {
        e.preventDefault();
        $('.emailErrorText').text('Please enter correct email');
        $('#mail').addClass('inputError');
    }

    // Checks for valid email
    function isValidEmail (email) {
       return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,10}/i.test(email);
    }

    // Checks at least one activity is checked
    let totalChecked = 0;
    for (let i = 0; i < $option.length; i++) {
        if ($option[i].checked)
            totalChecked += 1;
     }

     if (!totalChecked > 0) {
         e.preventDefault();
         $('.activityErrorText').text('Please select at least one activity');
    }

    // Calls isValidCard() if credit card is chosen
    if ($payment == 'credit card') {
        const cardNumber = $('#cc-num').val();
        const zip = $('#zip').val();
        const cvv = $('#cvv').val();
        if (isValidCard(cardNumber, zip, cvv) == false) {
            e.preventDefault();
            $('.paymentErrorText').text('Please enter correct credit card information');
            $('#cc-num').addClass('inputError');
            $('#zip').addClass('inputError');
            $('#cvv').addClass('inputError');
        }
    }

    // Checks credit card information
    function isValidCard (number, zip, cvv) {
       if( /[0-9]{13,16}/.test(number) &&
           /[0-9]{5}/.test(zip) &&
           /[0-9]{3}/.test(cvv))
           return true;
       else
           return false
    }

    // Prevents user from submitting form unless payment method is chosen
    if ($payment == 'select_method') {
        e.preventDefault();
        $('.paymentErrorText').text('Please choose payment method');
    }
}); // End $('form').submit()
