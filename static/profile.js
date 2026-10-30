// Phone profile cards: photo carousel + scroll-down button (set up separately for EACH card),
// and showing only the profile that matches the dating preference chosen in the form.

document.querySelectorAll(".tinder_profile_card").forEach(function (card) {
    const scrollBox = card.querySelector(".profile-scroll");
    const downBtn = card.querySelector(".scroll-down-btn");
    const photos = card.querySelectorAll(".photo");
    const bars = card.querySelector(".photo-bars");
    let currentPhoto = 0;

    // Scroll-down button
    downBtn.addEventListener("click", function () {
        scrollBox.scrollTo({ top: 600, behavior: "smooth" });
    });

    // One bar per photo
    photos.forEach(function () {
        bars.appendChild(document.createElement("span"));
    });

    function showPhoto(n) {
        currentPhoto = Math.max(0, Math.min(n, photos.length - 1));   // stops at the first and last photo
        photos.forEach(function (p, k) { p.classList.toggle("active", k === currentPhoto); });
        Array.from(bars.children).forEach(function (b, k) { b.classList.toggle("active", k === currentPhoto); });
    }

    card.querySelector(".photo-next").addEventListener("click", function () { showPhoto(currentPhoto + 1); });
    card.querySelector(".photo-prev").addEventListener("click", function () { showPhoto(currentPhoto - 1); });

    showPhoto(0);
});

// Show only the profile whose data-preference matches the radio button chosen in step 3
const profileOptions = document.querySelectorAll(".profile-option");
const preferenceRadios = document.querySelectorAll('input[name="preference"]');

function showMatchingProfile() {
    const chosen = document.querySelector('input[name="preference"]:checked');
    profileOptions.forEach(function (option) {
        option.hidden = !chosen || option.dataset.preference !== chosen.value;
    });
}

preferenceRadios.forEach(function (radio) {
    radio.addEventListener("change", showMatchingProfile);
});
showMatchingProfile();