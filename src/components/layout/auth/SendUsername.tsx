import React from "react";
import Button from "@/components/common/buttons/Button";
import Form from "@/components/common/Form";
import TextInput from "@/components/common/inputs/TextInput";
import PointsLoader from "@/components/common/loader/PointsLoader";
import { MagnifyingGlass } from "@phosphor-icons/react";

type Props = {
  loading: boolean;
  search_username: (username: string) => void;
};

interface Recover extends Record<string, unknown> {
  username: string;
}
const SendUsername = ({ search_username, loading }: Props) => {
  const onSubmit = (data: Recover) => {
    search_username(data.username);
  };

  return (
    <Form<Recover>
      onSubmit={onSubmit}
      className="mx-auto mb-4 flex min-w-[300px] max-w-sm flex-col space-y-7"
    >
      {({ register }) => (
        <>
          <div className="flex flex-col space-y-4">
            <TextInput
              id="username"
              required
              label="Usuario"
              placeholder="usuario"
              {...register("username")}
            />
          </div>

          <Button disabled={loading} type="submit">
            {loading ? (
              <PointsLoader />
            ) : (
              <>
                <span>Buscar</span>
                <MagnifyingGlass size={20} className="ml-2" />
              </>
            )}
          </Button>
        </>
      )}
    </Form>
  );
};

export default SendUsername;
