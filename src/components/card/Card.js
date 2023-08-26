import { useStyleConfig, chakra, forwardRef } from '@chakra-ui/react';
const CustomCard = forwardRef((props, ref) => {
	const { size, variant, ...rest } = props;
	const styles = useStyleConfig('Card', { size, variant });

	return <chakra.div ref={ref} __css={styles} {...rest} />;
});

export default CustomCard;
