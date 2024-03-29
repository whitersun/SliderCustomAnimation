const fetchData = async () => {
    const response = await fetch('./data.json');
    const data = await response.json();

    const getTranslateDate = localStorage.getItem('translationsData');

    if (getTranslateDate) return;
    else localStorage.setItem('translationsData', JSON.stringify(data));

    return data;
}

fetchData();