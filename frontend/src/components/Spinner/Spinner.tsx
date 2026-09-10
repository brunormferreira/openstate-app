import { Wrap, Center } from './Spinner.styles';

export function Spinner() {
  return (
    <Center>
      <Wrap aria-label="Loading" role="status" />
    </Center>
  );
}