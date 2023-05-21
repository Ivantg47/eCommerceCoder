export const head = (cliente, ticket, fecha) => {return `<html>
    <head>
      <!-- Compiled with Bootstrap Email version: 1.3.1 --><meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="x-apple-disable-message-reformatting">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <style type="text/css">
        body,table,td{font-family:Helvetica,Arial,sans-serif !important}.ExternalClass{width:100%}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:150%}a{text-decoration:none}*{color:inherit}a[x-apple-data-detectors],u+#body a,#MessageViewBody a{color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit}img{-ms-interpolation-mode:bicubic}table:not([class^=s-]){font-family:Helvetica,Arial,sans-serif;mso-table-lspace:0pt;mso-table-rspace:0pt;border-spacing:0px;border-collapse:collapse}table:not([class^=s-]) td{border-spacing:0px;border-collapse:collapse}@media screen and (max-width: 600px){.w-full,.w-full>tbody>tr>td{width:100% !important}.w-16,.w-16>tbody>tr>td{width:64px !important}.p-lg-10:not(table),.p-lg-10:not(.btn)>tbody>tr>td,.p-lg-10.btn td a{padding:0 !important}.pr-4:not(table),.pr-4:not(.btn)>tbody>tr>td,.pr-4.btn td a,.px-4:not(table),.px-4:not(.btn)>tbody>tr>td,.px-4.btn td a{padding-right:16px !important}.pl-4:not(table),.pl-4:not(.btn)>tbody>tr>td,.pl-4.btn td a,.px-4:not(table),.px-4:not(.btn)>tbody>tr>td,.px-4.btn td a{padding-left:16px !important}.pt-8:not(table),.pt-8:not(.btn)>tbody>tr>td,.pt-8.btn td a,.py-8:not(table),.py-8:not(.btn)>tbody>tr>td,.py-8.btn td a{padding-top:32px !important}.pb-8:not(table),.pb-8:not(.btn)>tbody>tr>td,.pb-8.btn td a,.py-8:not(table),.py-8:not(.btn)>tbody>tr>td,.py-8.btn td a{padding-bottom:32px !important}*[class*=s-lg-]>tbody>tr>td{font-size:0 !important;line-height:0 !important;height:0 !important}.s-4>tbody>tr>td{font-size:16px !important;line-height:16px !important;height:16px !important}.s-6>tbody>tr>td{font-size:24px !important;line-height:24px !important;height:24px !important}}
      </style>
    </head>
    <body style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;" bgcolor="#ffffff">
      <table class="body" valign="top" role="presentation" border="0" cellpadding="0" cellspacing="0" style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;" bgcolor="#ffffff">
        <tbody>
          <tr>
            <td valign="top" style="line-height: 24px; font-size: 16px; margin: 0;" align="left">
              <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                <tbody>
                  <tr>
                    <td align="center" style="line-height: 24px; font-size: 16px; margin: 0; padding: 0 16px;">
                      <!--[if (gte mso 9)|(IE)]>
                        <table align="center" role="presentation">
                          <tbody>
                            <tr>
                              <td width="600">
                      <![endif]-->
                      <table align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 900px; margin: 0 auto;">
                        <tbody>
                          <tr>
                            <td style="line-height: 24px; font-size: 16px; margin: 0;" align="left">
                              <table class="s-6 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                <tbody>
                                  <tr>
                                    <td style="line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;" align="left" width="100%" height="24">
                                      &#160;
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <img class="w-16" src="/public/img/logo.png" style="height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; width: 64px; border-style: none; border-width: 0;" width="64">
                              <table class="s-6 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                <tbody>
                                  <tr>
                                    <td style="line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;" align="left" width="100%" height="24">
                                      &#160;
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <div class="space-y-4">
                                <h1 class="text-4xl fw-800" style="padding-top: 0; padding-bottom: 0; font-weight: 800 !important; vertical-align: baseline; font-size: 36px; line-height: 43.2px; margin: 0;" align="left">Confirmaci&#243;n de Compra</h1>
                                <table class="s-4 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                  <tbody>
                                    <tr>
                                      <td style="line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;" align="left" width="100%" height="16">
                                        &#160;
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <p class="" style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="left">Estimado/a ${cliente},</p>
                                <table class="s-4 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                  <tbody>
                                    <tr>
                                      <td style="line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;" align="left" width="100%" height="16">
                                        &#160;
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <p style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="left">Le informamos que hemos recibido su pedido y lo estamos procesando. A continuaci&#243;n se detallan los productos adquiridos:</p>
                              </div>
                              <table class="s-6 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                <tbody>
                                  <tr>
                                    <td style="line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;" align="left" width="100%" height="24">
                                      &#160;
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table class="card rounded-3xl px-4 py-8 p-lg-10" role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-radius: 24px; border-collapse: separate !important; width: 100%; overflow: hidden; border: 1px solid #e2e8f0;" bgcolor="#ffffff">
                                <tbody>
                                  <tr>
                                    <td style="line-height: 24px; font-size: 16px; width: 100%; border-radius: 24px; margin: 0; padding: 40px;" align="left" bgcolor="#ffffff">
                                      <table class="container text-center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; text-align: center !important;">
                                        <tbody>
                                          <tr>
                                            <td align="center" style="line-height: 24px; font-size: 16px; margin: 0; padding: 0 16px;">
                                              <!--[if (gte mso 9)|(IE)]>
                                                <table align="center" role="presentation">
                                                  <tbody>
                                                    <tr>
                                                      <td width="600">
                                              <![endif]-->
                                              <table align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto;">
                                                <tbody>
                                                  <tr>
                                                    <td style="line-height: 24px; font-size: 16px; margin: 0;" align="left">
                                                      <div class="row" style="margin-right: -24px;">
                                                        <table class="" role="presentation" border="0" cellpadding="0" cellspacing="0" style="table-layout: fixed; width: 100%;" width="100%">
                                                          <tbody>
                                                            <tr>
                                                              <td class="col" style="line-height: 24px; font-size: 16px; min-height: 1px; font-weight: normal; padding-right: 24px; margin: 0;" align="left" valign="top">
                                                                <p style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="left"><strong>N&#250;mero del pedido: </strong>${ticket}</p>
                                                              </td>
                                                              <td class="col" style="line-height: 24px; font-size: 16px; min-height: 1px; font-weight: normal; padding-right: 24px; margin: 0;" align="left" valign="top">
                                                                <p style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="left"><strong>Fecha del pedido: </strong>${fecha}</p>
                                                              </td>
                                                            </tr>
                                                          </tbody>
                                                        </table>
                                                      </div>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                              <!--[if (gte mso 9)|(IE)]>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                              <![endif]-->
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <table class="table table-striped" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 100%;">
                                        <thead>
                                          <tr>
                                            <th width="50%" style="line-height: 24px; font-size: 16px; border-bottom-width: 2px; border-bottom-color: #e2e8f0; border-bottom-style: solid; border-top-width: 1px; border-top-color: #e2e8f0; border-top-style: solid; margin: 0; padding: 12px;" align="left" valign="top">Producto</th>
                                            <th width="10%" class="text-end" style="line-height: 24px; font-size: 16px; border-bottom-width: 2px; border-bottom-color: #e2e8f0; border-bottom-style: solid; border-top-width: 1px; border-top-color: #e2e8f0; border-top-style: solid; margin: 0; padding: 12px;" align="left" valign="top">Cantidad</th>
                                            <th width="20%" class="text-end" style="line-height: 24px; font-size: 16px; border-bottom-width: 2px; border-bottom-color: #e2e8f0; border-bottom-style: solid; border-top-width: 1px; border-top-color: #e2e8f0; border-top-style: solid; margin: 0; padding: 12px;" align="left" valign="top">Precio Unitario</th>
                                            <th width="20%" class="text-end" style="line-height: 24px; font-size: 16px; border-bottom-width: 2px; border-bottom-color: #e2e8f0; border-bottom-style: solid; border-top-width: 1px; border-top-color: #e2e8f0; border-top-style: solid; margin: 0; padding: 12px;" align="left" valign="top">Subtotal</th>
                                          </tr>
                                        </thead>
                                        <tbody>`
}

export const body = (producto, cantidad, precio, subotal) => {
    return `<tr style="" bgcolor="#f2f2f2">
    <td style="line-height: 24px; font-size: 16px; border-top-width: 1px; border-top-color: #e2e8f0; border-top-style: solid; margin: 0; padding: 12px;" align="left" valign="top">${producto}</td>
    <td class="text-right" style="line-height: 24px; font-size: 16px; border-top-width: 1px; border-top-color: #e2e8f0; border-top-style: solid; margin: 0; padding: 12px;" align="right" valign="top">${cantidad}</td>
    <td class="text-right" style="line-height: 24px; font-size: 16px; border-top-width: 1px; border-top-color: #e2e8f0; border-top-style: solid; margin: 0; padding: 12px;" align="right" valign="top">${precio}</td>
    <td class="text-right" style="line-height: 24px; font-size: 16px; border-top-width: 1px; border-top-color: #e2e8f0; border-top-style: solid; margin: 0; padding: 12px;" align="right" valign="top">${subotal}</td>
  </tr>`
}

export const foot = (total) => {
    return `</tbody>
                <tfoot higth="40px">
                <tr higth="40px">
                    <td colspan="3" class="text-right border-top" style="line-height: 24px; font-size: 16px; border-top-width: 1px !important; border-top-color: #e2e8f0 !important; border-top-style: solid !important; margin: 0; padding: 10px 12px;" align="right" valign="top">Total:</td>
                    <td class="text-right" style="line-height: 24px; font-size: 16px; border-top-width: 1px; border-top-color: #e2e8f0; border-top-style: solid; margin: 0; padding: 12px;" align="right" valign="top">${total}</td>
                </tr>
                </tfoot>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            <table class="s-6 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
            <tbody>
            <tr>
            <td style="line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;" align="left" width="100%" height="24">
            &#160;
            </td>
            </tr>
            </tbody>
            </table>
            <div class="space-y-4">
            <p class="" style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="left">Gracias por confiar en nuestra tienda en l&#237;nea. Si tiene alguna pregunta o problema con su pedido, no dude en ponerse en contacto con nuestro equipo de soporte.</p>
            <table class="s-4 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
            <tbody>
            <tr>
            <td style="line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;" align="left" width="100%" height="16">
                &#160;
            </td>
            </tr>
            </tbody>
            </table>
            <p class="" style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="left">Atentamente,</p>
            <table class="s-4 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
            <tbody>
            <tr>
            <td style="line-height: 16px; font-size: 16px; width: 100%; height: 16px; margin: 0;" align="left" width="100%" height="16">
                &#160;
            </td>
            </tr>
            </tbody>
            </table>
            <p style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="left">El equipo de eCommers</p>
            </div>
            <table class="s-6 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
            <tbody>
            <tr>
            <td style="line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;" align="left" width="100%" height="24">
            &#160;
            </td>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </tbody>
            </table>
            <![endif]-->
            </td>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            </body>
            </html>`
}

export const forgot = (link) => {
  return `<h1>Recuperación de contraseña</h1>
          <p>Apreciado cliente,
          <br>
          Recientemente se a solicitado restablecer la contraseña para acceder a su cuenta. Si usted no lo ha solicitado, por favor ignore este mensaje. Caducara en 1 hora.
          <br><br>
          <b>Para restablecer su contraseña, por favor visite el siguiente URL:</b>
          <br><br>
          <a href="${link}" class="form-button button">Restaurar contraseña</a>
          <a href="${link}">${link}</a>
          <br><br>
          Cundo visite este enlace, tendrá la oportunidad de elegir una nueva contraseña.
          <br><br>
          Para cualquier duda estamos a su disposición.
          <br><br>
          Atentamente,
          <br><br><br>
          Equipo de Ecommerce
          </p>
          <style>
          .button {
              display: block;
              width: 200px;
              height: 22px;
              background: rgba(255, 235, 59);;
              padding: 10px;
              text-align: center;
              border-radius: 5px;
              color: black;
              font-weight: bold;
              line-height: 25px;
              text-decoration: none;
              margin: 25px;
          }
          .form-button:hover,
          .form-button:focus,
          .form-button:active,
          .form-button.active,
          .form-button:active:focus,
          .form-button:active:hover,
          .form-button.active:hover,
          .form-button.active:focus {
              background-color: rgba(255, 235, 59, 0.473);
              border-color: rgba(255, 235, 59, 0.473);
          }
          </style>`
}


