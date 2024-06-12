
const generateRandomIdName = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const columnType_question = (columnName, DohaveNullValue, isLastElement, functionCallForLastElement) => {
    // generate impute question if DohaveNullValue == true

    let values = ['numerical', 'nominal', 'ordinal']
    let id_name = generateRandomIdName();
    let inputName = `${columnName}_columnType`
    return `
        <div id="${id_name}" class="container__body">
            <label class="label-primary">What Is The Type Of "<span>${columnName}</span>" Column?</label>
            <div class="buttonsOptions">
                ${values.map((value, i) => (`
                    <label class="button-primary ${i == 0 ? 'special':''}">${value}
                        <input type="radio" name="${inputName}" value="${value}" onclick="closeSection('${id_name}'); ${DohaveNullValue ? `generateImputeQuestion('${columnName}');`:""} ${isLastElement? `${functionCallForLastElement}()`:""};"></input>
                    </label>
                `)).join('')}
            </div>
        </div>
        `
}

const impute_question = (columnName, columnType) => {
    let values = {
        'remove row': 'delete',
        'mean impute': 'mean',
        'median impute': 'median',
        'mode impute': 'mode'
    }
    let id_name = generateRandomIdName();
    let inputName = `${columnName}_imputeType`

    if (columnType == 'nominal' || columnType == 'ordinal') {
        values = {
            'remove row': 'delete',
            'mode impute': 'mode'
        }
    }

    
    return `
        <div id="${id_name}" class="container__body">
            <label class="label-primary">"<span>${columnName}</span>" column has null value(s): What do you want to do?</label>
            <div class="buttonsOptions">
                ${Object.keys(values).map((value, i) => (`
                    <label class="button-primary ${i == 0 ? 'special':''}">${value}
                        <input type="radio" name="${inputName}" value="${values[value]}" onclick="closeSection('${id_name}'); "></input>
                    </label>
                `)).join('')}
            </div>
        </div>
        `
    
}

const columnNormalization_question = (columnName) => {
    let values = { // { what user see : what will be sent to the server }
        'StandardScaler': 'StandardScaler',
        'MinMaxScaler': 'MinMaxScaler',
        'z-score': 'z-score',
        "don't normalize": "None"
    }
    let id_name = generateRandomIdName();
    let inputName = `${columnName}_normalizationType`
    return `
        <div id="${id_name}" class="container__body">
            <label class="label-primary">Do You want to Normalize "<span>${columnName}</span>" Column?</label>
            <div class="buttonsOptions">
                ${Object.keys(values).map((value, i) => (`
                    <label class="button-primary ${i == 0 ? 'special':''}">${value}
                        <input type="radio" name="${inputName}" value="${values[value]}" onclick="closeSection('${id_name}');"></input>
                    </label>
                `)).join('')}
            </div>
        </div>
        `
}

const nominalEncoding_question = (columnName) => {
    let values = {
        'OneHotEncoder': 'OneHotEncoder',
        'LabelEncoder': 'LabelEncoder',
        "don't encode": "None"
    }
    let id_name = generateRandomIdName();
    let inputName = `${columnName}_nominal_encodingType`
    return `
        <div id="${id_name}" class="container__body">
            <label class="label-primary">Do You want to Encode "<span>${columnName}</span>" Column?</label>
            <div class="buttonsOptions">
                ${Object.keys(values).map((value, i) => (`
                    <label class="button-primary ${i == 0 ? 'special':''}">${value}
                        <input type="radio" name="${inputName}" value="${values[value]}" onclick="closeSection('${id_name}');"></input>
                    </label>
                `)).join('')}
            </div>
        </div>
        `
}

const ordinalEncoding_question = (columnName, functionCallForOrdinalOrder, isLastElement, LastElementCallFunction) => {
    let values = {
        'OrdinalEncoder': 'OrdinalEncoder',
        "don't encode": "None"
    }
    let id_name = generateRandomIdName();
    let inputName = `${columnName}_ordinal_encodingType`
    return `
        <div id="${id_name}" class="container__body">
            <label class="label-primary">Do You want to Encode "<span>${columnName}</span>" Column?</label>
            <div class="buttonsOptions">
                ${Object.keys(values).map((value, i) => (`
                    <label class="button-primary ${i == 0 ? 'special':''}">${value}
                        <input type="radio" name="${inputName}" value="${values[value]}" onclick="closeSection('${id_name}'); ${functionCallForOrdinalOrder}('${columnName}', '${values[value]}'); ${isLastElement?`${LastElementCallFunction}()`:''}"></input>
                    </label>
                `)).join('')}
            </div>
        </div>
        `
}

const ordinalOrder_question = (columnName, uniqueValues, ordinalValue, options, usedOptions, index, AddToUsedOption) => {

    let id_name = generateRandomIdName();
    let inputName = `${columnName}_|%|_${ordinalValue}_ordinal_order`
    console.log(`${usedOptions}`);
    return `
        <div id="${id_name}" class="container__body">
            <label class="label-primary">in ordinal column "<span>${columnName}</span>", what is the order of the unique value highlighted in blue?</label>
            <label class="label-list">[${uniqueValues.map((u,i) => i==index?`<span>${ordinalValue}</span>`:u).join(", ")}]</label>
            <div class="buttonsOptions">
                ${options
                  .map((value, i) => {
                    return `
                        <label class="button-primary 
                        ${usedOptions.includes(value) ? " disabled " : ""}
                        ${i == 0 ? " special " : ""}">${value}
                            <input type="radio" 
                            ${usedOptions.includes(value) ? "disabled" : ""}
                            name="${inputName}" value="${value}" onclick="closeSection('${id_name}'); ${AddToUsedOption}('${columnName}', ${value}, ${
                      index + 1
                    })"></input>
                        </label>
                    `;
                  })
                  .join("")}
            </div>
        </div>
        `;
}