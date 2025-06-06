const main = async () => {
  const response = await fetch('https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/MichelinStar.svg/512px-MichelinStar.svg.png?20200806093601', {
    method: 'GET',
  });

  const image = await response.text();

  console.log(response.headers);
}

main();