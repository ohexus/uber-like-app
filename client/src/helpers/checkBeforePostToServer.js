export default function checkBeforePostToServer(inputsArr, warnFunc) {
    const trimmed = inputsArr.map(i => i.trim());

    let isValid = true;

    trimmed.forEach(item => {
        if (!item) {
            warnFunc(true);
            isValid = false;
        }
    });

    return isValid
}