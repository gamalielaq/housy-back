import "dotenv/config";
import * as bcrypt from "bcryptjs";
import dataSource from "../data-source";
import { ApplicationStatus } from "../../common/enums/application-status.enum";
import { Application } from "../../modules/applications/entities/application.entity";

const DEFAULT_APP_NAME = "Identity Web";
const DEFAULT_APP_CODE = "identity";
const DEFAULT_APP_CLIENT_ID = "identity-web";

async function seedDefaultApplication() {
  await dataSource.initialize();

  try {
    const applicationsRepository = dataSource.getRepository(Application);
    const name = process.env.DEFAULT_APP_NAME ?? DEFAULT_APP_NAME;
    const code = process.env.DEFAULT_APP_CODE ?? DEFAULT_APP_CODE;
    const clientId = process.env.DEFAULT_APP_CLIENT_ID ?? DEFAULT_APP_CLIENT_ID;
    const clientSecret = process.env.DEFAULT_APP_CLIENT_SECRET;
    const clientSecretHash = clientSecret
      ? await bcrypt.hash(clientSecret, 12)
      : null;

    const existingApplication = await applicationsRepository.findOne({
      where: [{ clientId }, { code }],
    });

    if (existingApplication) {
      existingApplication.name = name;
      existingApplication.code = code;
      existingApplication.clientId = clientId;
      existingApplication.status = ApplicationStatus.ACTIVE;

      if (clientSecretHash) {
        existingApplication.clientSecretHash = clientSecretHash;
      }

      const application =
        await applicationsRepository.save(existingApplication);
      console.log(
        `Default application updated: ${application.name} (${application.clientId})`,
      );
      return;
    }

    const application = await applicationsRepository.save(
      applicationsRepository.create({
        name,
        code,
        clientId,
        clientSecretHash,
        status: ApplicationStatus.ACTIVE,
      }),
    );

    console.log(
      `Default application created: ${application.name} (${application.clientId})`,
    );
  } finally {
    await dataSource.destroy();
  }
}

void seedDefaultApplication().catch((error) => {
  console.error("Default application seed failed", error);
  process.exit(1);
});
