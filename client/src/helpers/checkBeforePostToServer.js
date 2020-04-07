export default function checkBeforePostToServer(inputsArr) {
  const trimmed = inputsArr.map((i) => i.toString().trim());

  let isValid = true;

  trimmed.forEach((item) => {
    if (!item) {
      isValid = false;
    }
  });

  return isValid;
}
