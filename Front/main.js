fetch("/api/test")
  .then(res => res.json())
  .then(data => {
    //affichage du json dans la console
    console.log("Réponse API :");
    console.log(data.message);
    console.log(data.nombre);

    //affichage du json dans la div
    let uneDiv = document.getElementById("maDiv1");
    uneDiv.innerHTML = `<p>Message : ${data.message}</p>
                        <p>Nombre : ${data.nombre}</p>`;
  })
  .catch(err => console.error("Erreur API :", err));