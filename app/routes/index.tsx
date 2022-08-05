import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { commitSession, getSession } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("cart")) {
    session.set("cart", ["hello"]);
  }

  return json(
    { cart: session.get("cart") },
    {
      headers: { "Set-Cookie": await commitSession(session) },
    }
  );
};

export const action = async ({ request }: ActionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const previousCart = session.get("cart");
  console.log(previousCart);
  let newCart = [...previousCart, "world"];
  session.set("cart", newCart);
  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
};

export default function Index() {
  let data = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>

      <Form method="post">
        <button type="submit">Add to cart</button>
      </Form>
    </div>
  );
}
