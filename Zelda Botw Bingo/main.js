fetch('quests.json')
    .then((res) => res.json())
    .then((quests) => console.log(quests));