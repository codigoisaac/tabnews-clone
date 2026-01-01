import orchestrator from "tests/orchestrator";
import email from "infra/email";

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();

    await email.send({
      from: "Isaac <isaac@isaacmuniz.pro>",
      to: "muniz@isaacmuniz.pro",
      subject: "Test subject",
      text: "Body test.",
    });
  });
});
