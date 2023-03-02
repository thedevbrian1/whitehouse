import bcrypt from "bcryptjs";
import { redirect} from "@remix-run/node";

import { prisma } from "~/db.server";
import { sendEmail, makeId } from "~/utils.js"

export async function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function updateUserPassword(emailTo){  
  const currUser = await getUserByEmail(emailTo);
  
  if (!currUser) {
    throw new Response('The tenant email does not exist!', {
        status: 400
    });
  }

  const newPassword = await makeId(8);
  // console.log(newPassword);

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const tenantId = currUser.id;

  await prisma.user.update({
    where: {
        id: tenantId
    },
    data: {
        password: {
          update: {
            hash: hashedPassword,
          },
        },
    }
  });

  const userName = currUser.name;
    
  await sendEmail(newPassword, emailTo, userName);

  return redirect("/login");
}

export async function updateUserDetails(email, password){  
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.update({
    where:{
      email
    },
    data: {
      password: {
        update: {
          hash: hashedPassword,
        },
      },
    }
  })
}

export async function deleteUserByEmail(email) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(email, password) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
