import { Box, useStyleConfig } from '@chakra-ui/react';

function CardComponent(props) {
  const { variant, w, p, children, ...rest } = props;
  const styles = useStyleConfig('Card', { variant });
  // Pass the computed styles into the `__css` prop
  return (
    <Box
      __css={styles}
      {...rest}
      p={p ? p : '22px'}
      display='flex'
      flexDirection='column'
      width={w ? w : '100%'}
      boxShadow='0px 5px 14px rgba(0, 0, 0, 0.05)'
      borderRadius='20px'
      position='relative'
      wordWrap='break-word'
      backgroundClip='border-box'
      backgroundColor={'white'}
    >
      {children}
    </Box>
  );
}

export default CardComponent;
