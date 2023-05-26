// Header and filter sidebar logic
const hamburger = document.querySelector(".hamburgerMenu");
const navMenu = document.querySelector(".headerList");
const filterButton = document.querySelector(".filterButton");
const filterMenu = document.querySelector(".filtersContainer");
const filterOverlay = document.querySelector(".overlay");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
})

filterButton.addEventListener("click", () => {
    filterMenu.classList.toggle("active");
    filterOverlay.classList.toggle("active");
})

filterOverlay.addEventListener("click", () => {
    filterMenu.classList.remove("active");
    filterOverlay.classList.remove("active");
})



function openSubList(elementId) {
    const elementToToggle = document.getElementById(elementId);

    if (elementToToggle.style.display === "none") {
        elementToToggle.style.display = "block";
    }
    else {
        elementToToggle.style.display = "none";
    }
}


// Price slider logic
const rangeInput = document.querySelectorAll(".rangeInput input"),
    priceInput = document.querySelectorAll(".priceInput input"),
    progress = document.querySelector(".priceSlider .priceProgress");

let priceGap = 20;

priceInput.forEach(input => {
    input.addEventListener("input", e => {

        let minVal = parseInt(priceInput[0].value),
            maxVal = parseInt(priceInput[1].value);

        if((maxVal - minVal >= priceGap) && maxVal <= 500) {
            if(e.target.className === "inputMinPrice") {
                rangeInput[0].value = minVal;
                progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
            }
            else {
                rangeInput[1].value = maxVal;
                progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
            }
        }
    })
});

rangeInput.forEach(input => {
    input.addEventListener("input", e => {

        let minVal = parseInt(rangeInput[0].value),
            maxVal = parseInt(rangeInput[1].value);

        if(maxVal - minVal < priceGap) {
            if(e.target.className === "rangeMin") {
                rangeInput[0].value = maxVal - priceGap;
            }
            else {
                rangeInput[1].value = minVal + priceGap;
            }
        }
        else {
            priceInput[0].value = minVal;
            priceInput[1].value = maxVal;
            progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
            progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
        }
    })
});


// Dynamic loading of products
const productContainer = document.querySelector('.productCardsContainer');
const jsonFileURL = '../../assets/products/products.json';

fetch(jsonFileURL)
    .then(response => response.json())
    .then(data => {
        data.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'productCard';

            const productImage = document.createElement('img');
            productImage.alt = 'productImage';
            productImage.src = product.image;

            const productInfo = document.createElement('div');
            productInfo.className = 'productInfo';

            const productName = document.createElement('p');
            productName.className = 'productName';
            productName.textContent = product.name;

            const productPrice = document.createElement('p');
            productPrice.className = 'productPrice';
            productPrice.textContent = product.price;

            productInfo.appendChild(productName);
            productInfo.appendChild(productPrice);
            productCard.appendChild(productImage);
            productCard.appendChild(productInfo);

            productContainer.appendChild(productCard);
        });
    })
    .catch(error => console.error('Can`t read JSON:', error));

