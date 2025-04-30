// Either we add each devs email to this list or we skip the email in dev
// make a function that takes the stage and returns the sender email
// it should be a switch statement with dev, prod, alv and gustavrobertsson
function getSenderEmail(stage: string) {
  switch (stage) {
    case "dev":
      return "johan.byren@elva-group.com";
    case "prod":
      return "info@weddingwish.se";
    case "johanbyren":
      return "johan.byren+weddingwish@elva-group.com";
    default:
      return "johan.byren@elva-group.com";
  }
}

export const email = new sst.aws.Email("Email", {
  sender: getSenderEmail($app.stage),
});
