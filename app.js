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
        let tracking = document.getElementById('tracking').value;
        //let DNIa = document.getElementById('DNIa').value;
        let DNIanum = document.getElementById('DNIanum').value;
        let nombrea = document.getElementById('nombrea').value;




        generatePDF(DNInum, nombre, tracking, DNIanum, nombrea);
    })

});

async function generatePDF(DNInum, nombre, tracking, DNIanum, nombrea) {
    const image = await loadImage("formulario.jpg");
    const signatureImage = signaturePad.toDataURL();

    const pdf = new jsPDF('l', 'px', 'a4');
    pdf.setFont("arial");
    pdf.setFontType("bold");

    pdf.addImage(image, 'JPG', 37, 25, 555, 391);
    pdf.addImage(signatureImage, 'PNG', 335, 330, 300, 60);


    const date = new Date();
    pdf.text(date.toLocaleDateString(), 300, 230);
    pdf.text('FECHA:', 250, 230);


    pdf.setFontSize(18);
    //pdf.text(DNI, 170, 213);
    pdf.text('123456789Z', 95, 277); //DNInum
    pdf.text('FEDERICO GARCIA LORCA', 65, 254); //nombre

    pdf.text('PK23456787654323456Z', 148, 359);//tracking
    //pdf.text(DNIa, 170, 213);
    pdf.text('987654312Z', 160, 331);//DNIanum
    pdf.text('TU PRIMA LA CALVA', 100, 303);//nombrea






    pdf.save("autorizacion.pdf");

}