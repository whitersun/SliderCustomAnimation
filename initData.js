const fetchData = async () => {
    const response = await fetch('./data.json');
    const data = await response.json();

    localStorage.setItem('translationsData', JSON.stringify(data));

    return data;
}

fetchData();