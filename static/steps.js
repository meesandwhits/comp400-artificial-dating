
function setUpSteps() {
    const form = document.getElementById("testerForm");
    if (!form) return; // this page has no multi-step form, so do nothing
    const steps = Array.from(form.querySelectorAll(".step"));
    const nextBtn = document.getElementById("nextBtn");
    const label = document.getElementById("progress-label");
    const bar = document.getElementById("progress-bar");
    let current = 0;
 
    bar.max = steps.length;
 
    function render() {
        steps.forEach((step, i) => step.classList.toggle("active", i === current));
        nextBtn.textContent = current === steps.length - 1 ? "Submit" : "Next";
        label.textContent = "Question " + (current + 1) + " of " + steps.length;
        bar.value = current + 1;
 
        // Put the cursor in a text box if this step has one
        const textBox = steps[current].querySelector("input[type='text']");
        if (textBox) textBox.focus();
    }
 
    // Uses the browser's built-in validation (the `required` attributes in the HTML),
    // but only for the fields on the step currently showing.
    function currentStepIsValid() {
        const fields = steps[current].querySelectorAll("input, select, textarea");
        for (const field of fields) {
            if (!field.checkValidity()) {
                field.reportValidity();
                return false;
            }
        }
        return true;
    }
 
    nextBtn.addEventListener("click", function () {
        if (!currentStepIsValid()) return;
        if (current === steps.length - 1) {
            form.submit();
        } else {
            current++;
            render();
        }
    });
 
    // Pressing Enter should act like "Next" instead of submitting the form early
    form.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            nextBtn.click();
        }
    });
 
    render();
}
 
// Wait until the whole page exists, so it works wherever the <script> tag is placed
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setUpSteps);
} else {
    setUpSteps();
}
 