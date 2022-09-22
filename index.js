async function doAPICall() {
    const resp = await fetch("https://restcountries.com/v3.1/subregion/europe");
    return await resp.json();
}

const searchInput = document.getElementById("searchInput");
const suggestionWrapper = document.getElementById("suggestionWrapper");

const optimisedHandleSearchInputChange = debounce(handleSearchInputChange, 500);
searchInput.addEventListener("keyup", optimisedHandleSearchInputChange);

async function handleSearchInputChange(event) {
    const val = event.target.value;

    if (val) {
        filterSuggestion(val);
    } else {
        suggestionWrapper.classList.remove("showSuggestionWrapper");
        suggestionWrapper.classList.add("hideSuggestionWrapper");
    }
    console.log("val", val)
}

async function filterSuggestion(searchText) {
    const allCounteries = await doAPICall();
    const filteredCounteries = allCounteries.filter(item => {
        const { name = {} } = item;
        const { common } = name || {}
        return common.toLowerCase().includes(searchText)
    }).map(item => item.name.common);

    // if (filteredCounteries)
    renderSuggestion(filteredCounteries);

    console.log("filteredCounteries", filteredCounteries)
}

function renderSuggestion(suggestions) {
    if (suggestions.length) {
        suggestionWrapper.innerText = "";
        suggestionWrapper.classList.remove("hideSuggestionWrapper");
        suggestionWrapper.classList.add("showSuggestionWrapper");
    } else {
        suggestionWrapper.classList.remove("showSuggestionWrapper");
        suggestionWrapper.classList.add("hideSuggestionWrapper");
    }

    const fragment = document.createDocumentFragment();
    suggestions.forEach(item => {
        const divEle = document.createElement("div");
        divEle.innerText = item;
        divEle.setAttribute("data-name", item);

        fragment.appendChild(divEle);
    });

    suggestionWrapper.appendChild(fragment);
}

function debounce(funcToCall, delay) {
    let timer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => { funcToCall.apply(context, args) }, delay);
    }
}
// Name - Region - Population - Flag