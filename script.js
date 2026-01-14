function getData() {
  return new Promise((resolve, rejet) => {
    setTimeout(() => {
      const success = true;
      if (success) {
        resolve("data mil gya ");
      } else {
        rejet("Data nhi mila");
      }
    }, 3000);
  });
}

getData()
  .then((result) => {
    console.log(" Success:", result);
  })
  .catch((error) => {
    console.log("Error :", error);
  });
