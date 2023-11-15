const now = new Date();
const table = document.querySelector('.table');
const container = document.querySelector('.container');
let filteredList = []
let studentsList = [
    {
        name: `Марк`,
        secondName: `Волонский`,
        surName: `Спардович`,
        birthDate: new Date(2003, 10, 18),
        eduDate: 2022,
        faculty: 'Програмная инженерия'
    },
    {
        name: `Дмитрий`,
        secondName: `Паркер`,
        surName: `Станиславович`,
        birthDate: new Date(2004, 6, 7),
        eduDate: 2022,
        faculty: 'Програмная инженерия'
    },
    {
        name: `Алиса`,
        secondName: `Штерн`,
        surName: `Олеговна`,
        birthDate: new Date(2003, 9, 18),
        eduDate: 2021,
        faculty: 'Филология'
    },
    {
        name: `Егор`,
        secondName: `Егоров`,
        surName: `Егорович`,
        birthDate: new Date(2000, 0, 1),
        eduDate: 2019,
        faculty: 'Програмная инженерия'
    },
    {
        name: `Ирина`,
        secondName: `Рыбалко`,
        surName: `Руслановна`,
        birthDate: new Date(2005, 8, 1),
        eduDate: 2023,
        faculty: 'Лингвистика'
    },
]

function formatDate(date) {

    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear();
    if (yy < 10) yy = '0' + yy;

    return dd + '.' + mm + '.' + yy;
}

function getStudentItem(studentObj) {
    const fullName = document.createElement('td');
    const faculty = document.createElement('td');
    const birthDate = document.createElement('td');
    const yearsOfEduc = document.createElement('td');

    fullName.textContent = studentObj.secondName + ' ' + studentObj.name + ' ' + studentObj.surName;

    let age = now.getFullYear() - studentObj.birthDate.getFullYear();
    age = (now.getMonth() < studentObj.birthDate.getMonth() || (now.getMonth() === studentObj.birthDate.getMonth() && now.getDate() < studentObj.birthDate.getDate())) ? age - 1 : age;
    birthDate.textContent = formatDate(studentObj.birthDate) + ` (${age} лет)`;
    faculty.textContent = studentObj.faculty;
    const yearOfEduc = studentObj.eduDate;
    const gradYear = parseInt(yearOfEduc) + 4;
    const course = (gradYear === now.getFullYear() && now.getMonth() >= 8) || now.getFullYear() > gradYear ? 'закончил' : `${(now.getFullYear() - yearOfEduc + 1)} курс`;
    yearsOfEduc.textContent = `${studentObj.eduDate}-${gradYear} (${course})`;

    return {
        fullName, faculty, birthDate, yearsOfEduc
    }
}

function renderStudentsTable(studentsArray) {
    const allRows = document.querySelectorAll('.stud-row');
    for (const row of allRows) { table.removeChild(row) };
    for (const stud of studentsArray) {
        const studItem = getStudentItem(stud);
        const row = document.createElement('tr');
        row.classList.add('stud-row')
        row.appendChild(studItem.fullName);
        row.appendChild(studItem.faculty);
        row.appendChild(studItem.birthDate);
        row.appendChild(studItem.yearsOfEduc);
        table.appendChild(row);
    }
}

renderStudentsTable(studentsList)

const form = document.querySelector('.form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = document.querySelectorAll('input');
    const fullNameInput = document.querySelector('.full-name').value;
    const birthInput = document.querySelector('.birth').valueAsDate;
    const eduYearInput = document.querySelector('.education-year').value;
    const facInput = document.querySelector('.fac').value;
    if (isValidInput(fullNameInput, birthInput, eduYearInput, facInput)) {
        studentsList.push(makeStudObj(fullNameInput, birthInput, eduYearInput, facInput));
        renderStudentsTable(studentsList);
        for (const inp of inputs) { inp.value = '' }
    }
})

function isValidInput(fullNameInput, birthInput, eduYearInput, facInput) {
    let errorContainer = document.createElement('div');
    errorContainer.classList.add('error-div');
    const errorText = document.createElement('p');
    errorText.classList.add('error-text');

    let flag = true;
    let errorString = 'Ошибка: '
    if (!fullNameInput || !birthInput || !eduYearInput || !facInput) {
        errorString += 'Все поля должны быть заполнены. ';
        flag = false;
    }
    if (birthInput < new Date(1900, 0, 1) || birthInput > now) {
        errorString += 'Неверная дата рождения. '
        flag = false;
    }
    if (eduYearInput < 2000 || eduYearInput > now.getFullYear()) {
        errorString += 'Неверный год начала обучения. '
        flag = false;
    }
    if (flag === false) {
        if (document.querySelector('.error-div')) {
            container.removeChild(document.querySelector('.error-div'));
        }
        errorText.textContent = errorString;
        errorContainer.appendChild(errorText);
        form.after(errorContainer);
    }
    else {
        if (document.querySelector('.error-div')) {
            container.removeChild(document.querySelector('.error-div'));
        }
    }
    return flag;
}

function makeStudObj(fullNameInput, birthInput, eduYearInput, facInput) {
    fullNameInput = fullNameInput.split(' ');
    const secondName = fullNameInput[0];
    const name = fullNameInput[1];
    const surName = fullNameInput[2];
    return {
        name: name,
        secondName: secondName,
        surName: surName,
        birthDate: birthInput,
        eduDate: eduYearInput,
        faculty: facInput
    }
}

function sortStudents(argument) {
    if (table.classList.contains('filtered')) {filteredList.sort((a, b) => studentCompare(argument, a, b));}
    else {studentsList.sort((a, b) => studentCompare(argument, a, b));
}}

function studentCompare(argument, a, b) {
    switch (argument) {
        case '0':
            const fName1 = a.secondName + ' ' + a.name + ' ' + a.surName;
            const fName2 = b.secondName + b.name + b.surName;
            return fName1.localeCompare(fName2);
            break;
        case '1':
            const fac1 = a.faculty;
            const fac2 = b.faculty;
            return fac1.localeCompare(fac2)
            break;
        case '2':
            return a.birthDate - b.birthDate;
            break;
        case '3':
            return a.eduDate - b.eduDate;
            break;
    }
}

for (const header of document.querySelectorAll('th')) {
    header.addEventListener('click', () => {
        sortStudents(header.className);
        if (table.classList.contains('filtered')) {renderStudentsTable(filteredList);}
        else {renderStudentsTable(studentsList)};
    })
}

const formFilter = document.querySelector('.form-filter');
formFilter.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullNameInputFilter = document.querySelector('.full-name-filter').value;
    const eduYearStartInputFilter = document.querySelector('.education-start-year-filter').value;
    const eduYearEndInputFilter = document.querySelector('.education-end-year-filter').value;
    const facInputFilter = document.querySelector('.fac-filter').value;
    filteredList = [...studentsList];
    console.log(filteredList)
    if (fullNameInputFilter) {
        filteredList = filteredList.filter(el =>
            (el.secondName + ' ' + el.name + ' ' + el.surName).toLowerCase().includes(fullNameInputFilter.toLowerCase()))
    }
    if (eduYearStartInputFilter) {
        filteredList = filteredList.filter(el => parseInt(el.eduDate) === parseInt(eduYearStartInputFilter))
    }
    if (eduYearEndInputFilter) {
        filteredList = filteredList.filter(el => parseInt(el.eduDate) + 4 === parseInt(eduYearEndInputFilter))
    }
    if (facInputFilter) {
        filteredList = filteredList.filter(el => el.faculty.toLowerCase().includes(facInputFilter.toLowerCase()))
    }
    renderStudentsTable(filteredList);
    table.classList.add('filtered');
    if (!fullNameInputFilter && !eduYearStartInputFilter && !eduYearEndInputFilter && !facInputFilter) {
        table.classList.remove('filtered')
    }
})