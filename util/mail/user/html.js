const html = (numberRegisteredUsersOnDay) => {
    const currentDate = new Date();

    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

	return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cantidad de registros del día</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                text-align: center;
            }
    
            .container {
                max-width: 400px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            h1 {
                font-size: 24px;
                margin-bottom: 20px;
            }
    
            p {
                font-size: 16px;
                color: #888;
                margin-bottom: 20px;
            }
    
            .centered-button {
                text-align: center;
            }
    
            .small-text {
                font-size: 12px;
                color: #888;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="centered-button">
                <h1>Cantidad de usuarios registrados</h1>
                <p>La cantidad de usuarios que se han registrado el día de hoy, ${day}/${month}/${year}, ha sido de ${numberRegisteredUsersOnDay}.</p>
                <p class="small-text">Este es un correo automatizado, por favor no respondas. Comunícate a correo@example.com en caso de tener dudas.</p>
            </div>
        </div>
    </body>
    </html>`;
};

module.exports = { html }