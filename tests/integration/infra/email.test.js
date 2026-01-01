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

    await email.send({
      from: "Isaac <last.from@isaacmuniz.pro>",
      to: "last.to@isaacmuniz.pro",
      subject: "Last email sent",
      text: "Last email body.",
    });

    const lastEmail = await orchestrator.getLastEmail();
    expect(lastEmail.sender).toBe("<last.from@isaacmuniz.pro>");
    expect(lastEmail.recipients[0]).toBe("<last.to@isaacmuniz.pro>");
    expect(lastEmail.subject).toBe("Last email sent");
    expect(lastEmail.text).toBe("Last email body.\n");
  });
});
