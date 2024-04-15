function ButtonOptionsForColumnType_Template(id_name, id, columnName) {
    values = ['numerical', 'nominal', 'ordinal']
    return `
        <div id="${id_name}" class="container__body">
            <label class="label-primary">What Is The Type Of "<span>${columnName}</span>" Column?</label>
            <div class="buttonsOptions">
                ${values.map((value, i) => (`
                    <label class="button-primary ${i == 0 ? 'special':''}">${value}
                        <input type="radio" name="${columnName}_type" value="${value}" onclick="closeSection('${id_name}')"></input>
                    </label>
                `)).join('')}
            </div>
        </div>
        `
}

class GenerateQuestions {
    // let Columns_IsNumerical = {}
    constructor(columnsNames = []) {
        this.columnsNames = columnsNames
        // this.typesOfColumns = []
        this.generateHTML(columnsNames)
        this.setSubmitButton()
    }
    
    
    generateHTML = (columnsNames = []) => {
        const QuestionsStartHere = document.getElementById("questionsStartHere"); // start after this element
        // generate questions html
        for (let i = 0; i < columnsNames.length; i++) {
            const id_name = `section_question_${i}`; // id for the section
            QuestionsStartHere.insertAdjacentHTML('beforeend', ButtonOptionsForColumnType_Template(id_name, i, columnsNames[i]))
        }
    }

    setSubmitButton = () => {
        const QuestionsStartHere = document.getElementById("questionsStartHere"); // start after this element
        QuestionsStartHere.insertAdjacentHTML('beforeend', `
            <div id="submitContainer" class="container__body">
                <label class="label-primary">Submit Your Answers</label>
                <button type="submit" id="section_question_submit" class="button-primary">Submit</button>
            </div>
        `)
        // document.getElementById("section_question_submit").addEventListener('click', this.submitQuestionsAnswers);
    }

    // questionButton = (question_id, answer) => { // answer is currnetly not boolean
    //     closeSection(`section_question_${question_id}`)
    //     this.typesOfColumns[question_id] = answer
    // }

    // submitQuestionsAnswers = () => {
    //     console.log(this.typesOfColumns)
    // }

}

// const questions = new GenerateQuestions(['name', 'age'])
