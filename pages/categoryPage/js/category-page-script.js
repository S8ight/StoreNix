addEventListenersForCategoriesButtons();
hamburgerMenuLogic();
filterMenuLogic();

(async () => {
    try {
        const products = await getProducts();
        setPriceValuesForPriceFilter(products);
    } catch (error) {
        console.error('Error: ', error);
    }
})();

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


function priceSliderLogic(minPrice, maxPrice) {
    const rangeMinInput = document.querySelector('.range-min');
    const rangeMaxInput = document.querySelector('.range-max');
    const inputMinPrice = document.querySelector('.input-min-price');
    const inputMaxPrice = document.querySelector('.input-max-price');
    const progress = document.querySelector('.price-progress');

    let priceGap = 20;

    const updateProgress = () => {
        const minVal = parseInt(rangeMinInput.value);
        const maxVal = parseInt(rangeMaxInput.value);
        const totalRange = rangeMaxInput.max - rangeMinInput.min;
        const left = ((minVal - rangeMinInput.min) / totalRange) * 100;
        const right = ((rangeMaxInput.max - maxVal) / totalRange) * 100;

        progress.style.left = `${left}%`;
        progress.style.right = `${right}%`;
    };

    const updateRangeInputs = () => {
        const minVal = parseInt(rangeMinInput.value);
        const maxVal = parseInt(rangeMaxInput.value);

        inputMinPrice.value = minVal;
        inputMaxPrice.value = maxVal+1;
    };

    const updatePriceInputs = () => {
        const minVal = parseInt(inputMinPrice.value);
        const maxVal = parseInt(inputMaxPrice.value);

        rangeMinInput.value = minVal;
        rangeMaxInput.value = maxVal;
    };

    rangeMinInput.addEventListener('input', () => {
        const minVal = parseInt(rangeMinInput.value);
        const maxVal = parseInt(rangeMaxInput.value);

        if (maxVal - minVal < priceGap) {
            rangeMinInput.value = maxVal - priceGap;
        }

        updateProgress();
        updateRangeInputs();
    });

    rangeMaxInput.addEventListener('input', () => {
        const minVal = parseInt(rangeMinInput.value);
        const maxVal = parseInt(rangeMaxInput.value);

        if (maxVal - minVal < priceGap) {
            rangeMaxInput.value = minVal + priceGap;
        }

        updateProgress();
        updateRangeInputs();
    });

    inputMinPrice.addEventListener('input', () => {
        let minVal = parseInt(inputMinPrice.value);
        let maxVal = parseInt(inputMaxPrice.value);

        if (minVal < 0 || minVal > maxPrice-priceGap) {
            minVal = minPrice;
            inputMinPrice.value = minPrice;
        }

        if ((maxVal - minVal >= priceGap)) {
            rangeMinInput.value = minVal;
        }

        updateProgress();
        updatePriceInputs();
    });

    inputMaxPrice.addEventListener('input', () => {
        let minVal = parseInt(inputMinPrice.value);
        let maxVal = parseInt(inputMaxPrice.value);

        if (maxVal > maxPrice) {
            maxVal = maxPrice;
            inputMaxPrice.value = maxPrice;
        }

        if ((maxVal - minVal >= priceGap) && maxVal <= maxPrice) {
            rangeMaxInput.value = maxVal;
        }

        updateProgress();
        updatePriceInputs();
    });

    rangeMinInput.min = minPrice;
    rangeMinInput.max = maxPrice;
    rangeMinInput.value = minPrice;

    rangeMaxInput.min = minPrice;
    rangeMaxInput.max = maxPrice;
    rangeMaxInput.value = maxPrice;

    inputMinPrice.value = minPrice;
    inputMaxPrice.value = maxPrice;

    updateProgress();
    updateRangeInputs();
}

function setPriceValuesForPriceFilter(products) {
    let minPrice = Number.MAX_VALUE;
    let maxPrice = Number.MIN_VALUE;

    products.forEach(product => {
        const price = parseFloat(product.variants[0].price);
        if (price < minPrice) {
            minPrice = price;
        }
        if (price > maxPrice) {
            maxPrice = price;
        }
    });

    priceSliderLogic(minPrice, maxPrice);
}

async function getProducts() {
    return await fetch('http://localhost:3000/products')
        .then(response => response.json())
        .then(products => {
            dynamicProductsLoading(products);
            return products;
        })
        .catch(error => {
            console.error('Failed to fetch products:', error);
        });
}

function dynamicProductsLoading(products) {
    const productContainer = document.querySelector('.product-cards-container');

    //setPriceGateForPriceFilter(products);
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        const productImage = document.createElement('img');
        productImage.alt = 'product-image';
        productImage.src = product.image.src;

        const productInfo = document.createElement('div');
        productInfo.className = 'product-info';

        const productName = document.createElement('p');
        productName.className = 'product-name';
        productName.textContent = product.title;

        const productPrice = document.createElement('p');
        productPrice.className = 'product-price';
        productPrice.textContent = product.variants[0].price+'$';

        productInfo.appendChild(productName);
        productInfo.appendChild(productPrice);
        productCard.appendChild(productImage);
        productCard.appendChild(productInfo);

        productContainer.appendChild(productCard);
    });
}

