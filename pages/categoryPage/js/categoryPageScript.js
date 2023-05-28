addEventListenersForCategoriesButtons();
hamburgerMenuLogic();
filterMenuLogic();
dynamicProductsLoading();
priceSliderLogic();

function addEventListenersForCategoriesButtons() {
    const categoriesButtons = document.querySelectorAll(".categories-button");

    categoriesButtons.forEach(button => {
        button.addEventListener("click", e => {
            const elementToToggle = document.getElementById(button.name);

            if (elementToToggle.style.display === "none") {
                elementToToggle.style.display = "block";
            }
            else {
                elementToToggle.style.display = "none";
            }
        })
    });
}


function hamburgerMenuLogic() {
    const hamburger = document.querySelector(".hamburger-menu");
    const navMenu = document.querySelector(".header-list");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    })
}


function filterMenuLogic() {
    const filterButton = document.querySelector(".filter-button");
    const filterMenu = document.querySelector(".filters-container");
    const filterOverlay = document.querySelector(".overlay");

    filterButton.addEventListener("click", () => {
        filterMenu.classList.toggle("active");
        filterOverlay.classList.toggle("active");
    })

    filterOverlay.addEventListener("click", () => {
        filterMenu.classList.remove("active");
        filterOverlay.classList.remove("active");
    })
}


function priceSliderLogic() {
    const rangeInput = document.querySelectorAll(".range-input input"),
        priceInput = document.querySelectorAll(".price-input input"),
        progress = document.querySelector(".price-slider .price-progress");



    let priceGap = 20;

    priceInput.forEach(input => {
        input.addEventListener("input", e => {

            let minVal = parseInt(priceInput[0].value),
                maxVal = parseInt(priceInput[1].value);

            if((maxVal - minVal >= priceGap) && maxVal <= 500) {
                if(e.target.className === "input-min-price") {
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
                if(e.target.className === "range-min") {
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
}

function setPriceGateForPriceFilter(products) {
    let minPrice = Number.MAX_VALUE;
    let maxPrice = Number.MIN_VALUE;

    products.forEach(product => {
        const price = parseFloat(product.price.replace('$', ''));
        if (price < minPrice) {
            minPrice = price;
        }
        if (price > maxPrice) {
            maxPrice = price;
        }
    });

    const rangeMinInput = document.querySelector('.range-min');
    const rangeMaxInput = document.querySelector('.range-max');

    rangeMinInput.min = 0;
    rangeMinInput.max = 500;
    rangeMinInput.value = minPrice;

    rangeMaxInput.min = 0;
    rangeMaxInput.max = 500;
    rangeMaxInput.value = maxPrice;
}

function dynamicProductsLoading() {
    const productContainer = document.querySelector('.product-cards-container');
    const jsonFileURL = '../../assets/products/products.json';

    fetch(jsonFileURL)
        .then(response => response.json())
        .then(data => {
            setPriceGateForPriceFilter(data);
            data.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';

                const productImage = document.createElement('img');
                productImage.alt = 'product-image';
                productImage.src = product.image;

                const productInfo = document.createElement('div');
                productInfo.className = 'product-info';

                const productName = document.createElement('p');
                productName.className = 'product-name';
                productName.textContent = product.name;

                const productPrice = document.createElement('p');
                productPrice.className = 'product-price';
                productPrice.textContent = product.price;

                productInfo.appendChild(productName);
                productInfo.appendChild(productPrice);
                productCard.appendChild(productImage);
                productCard.appendChild(productInfo);

                productContainer.appendChild(productCard);
            });
        })
        .catch(error => console.error('Can`t read JSON:', error));
}

