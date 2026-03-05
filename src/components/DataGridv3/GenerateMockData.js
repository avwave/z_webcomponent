import React from 'react'

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);    
}

function getRandomTitle() {
    const names = ['Breaking Bad', 'Peaky Blinders', 'Game Of Thrones', 'The Boys', 'Missing', 'The Three Idiots', 'Overlord', 'Taken'];
    return names[getRandomNumber(0, names.length - 1)];
}

function getRandomComment() {
    const comments = [
        'Great work!',
        'Needs improvement.',
        'Very informative.',
        'Not clear enough.',
        'Excellent!',
        'Could be better.',
        'Nice job!',
        'Confusing.',
    ];
    return comments[getRandomNumber(0, comments.length - 1)];
}

function GenerateMockData(numRows) {
    const rowData = [];
    let idCounter = 1;

    for (let i = 0; i < numRows; i++) {
        const row = {
            id: idCounter++,
            title: getRandomTitle(),
            location_scope: ['Global', 'Office', 'Regional'][getRandomNumber(0, 2)],
            reviews: getRandomNumber(1, 10),
            comments: getRandomComment(),
            filler: Math.random() < 0.5, // true or false randomly
            enabled: Math.random() < 0.5, // true or false randomly
        };

        rowData.push(row);
    }

    return rowData;
}

export default GenerateMockData