function loadImage(url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = "blob";
        xhr.onload = function (e) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const res = event.target.result;
                resolve(res);
            }
            const file = this.response;
            reader.readAsDataURL(file);
        }
        xhr.send();
    });
}

let signaturePad = null;

window.addEventListener('load', async () => {

    const canvas = document.querySelector("canvas");
    canvas.height = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;

    signaturePad = new SignaturePad(canvas, {});

    const form = document.querySelector('#form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        //let DNI = document.getElementById('DNI').value;
        let DNInum = document.getElementById('DNInum').value;
        let nombre = document.getElementById('nombre').value;
        let apellidos = document.getElementById('apellido').value;
        let tracking = document.getElementById('tracking').value;
        //let DNIa = document.getElementById('DNIa').value;
        let DNIanum = document.getElementById('DNIanum').value;
        let nombrea = document.getElementById('nombrea').value;
        let apellidosa = document.getElementById('apellidoa').value;



        generatePDF(DNInum, nombre, apellidos, tracking, DNIanum, nombrea, apellidosa);
    })

});

async function generatePDF(DNInum, nombre, apellidos, tracking, DNIanum, nombrea, apellidosa) {
    const image = await loadImage("formulario.jpg");
    const signatureImage = signaturePad.toDataURL();

    const pdf = new jsPDF('l', 'px', 'A4');
    pdf.setFont("arial");
    pdf.setFontType("bold");

    pdf.addImage(image, 'PNG', 0, 0, 699, 419);
    pdf.addImage(signatureImage, 'PNG', 50, 350, 300, 60);


    const date = new Date();
    pdf.text('FECHA:', 200, 220);
    pdf.text(date.getUTCDate().toString(), 250, 220);
    pdf.text('-', 255, 220);
    pdf.text((date.getUTCMonth() + 1).toString(), 260, 220);
    pdf.text('-', 265, 220);
    pdf.text(date.getUTCFullYear().toString(), 270, 220);

    pdf.setFontSize(15);
    //pdf.text(DNI, 170, 213);
    pdf.text(DNInum, 150, 250);
    pdf.text(nombre, 50, 235);
   //pdf.text(apellidos, 170, 456);
    pdf.text(tracking, 150, 325);
    //pdf.text(DNIa, 170, 213);
    pdf.text(DNIanum, 150, 295);
    pdf.text(nombrea, 130, 275);
    //pdf.text(apellidosa, 170, 456);





    pdf.save("autorizacion.pdf");

}