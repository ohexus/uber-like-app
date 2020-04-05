export default function checkBeforePostToServer(inputsArr, warnFunc) {
    const trimmed = inputsArr.map(i => i.trim());

    trimmed.forEach(item => {
        if (!item) {
            warnFunc(true);
            return
        }
    });
}