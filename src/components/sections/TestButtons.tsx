import ButtonBase from "../ui/base/ButtonBase";
import ButtonAction from "../ui/ButtonAction";
import ButtonLink from "../ui/ButtonLink";

export default function TestButtons() {
  return (
      <>
      <ButtonBase >Regular</ButtonBase>
      <ButtonBase  isSoft>Soft</ButtonBase>
      <ButtonAction  onClick={() => alert("Clicked!")}>Action</ButtonAction>
      <ButtonLink href='/' isSoft={true}>Link</ButtonLink>
      </>
  );
}
