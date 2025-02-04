const template = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>Page not found</title>
    </head>
    <body>
      <p>Page not found</p>
    </body>
  </html>
`;

export default defineEventHandler(async (event) => {
  setResponseStatus(event, 404, 'Page not found');
  event.node.res.setHeader('content-type', 'text/html');

  return template.replace(/\s{2,}/g, ' ');
});
