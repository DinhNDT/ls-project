import { CardBody, CardComponent, CardHeader } from '../components/Card'
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Link,
  Text,
  Input,
  IconButton,
  useColorMode,
  useColorModeValue,
  Textarea,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  FaCube,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaEdit,
} from 'react-icons/fa';

function ProfilePage() {
  const { colorMode } = useColorMode();
  const [editStatus, setEditStatus] = useState(false);

  // Chakra color mode
  const textColor = useColorModeValue('gray.700', 'white');
  const iconColor = useColorModeValue('blue.400', 'white');
  const bgProfile = useColorModeValue('hsla(0,0%,100%,.8)', 'navy.800');
  const borderProfileColor = useColorModeValue('white', 'transparent');
  const emailColor = useColorModeValue('gray.400', 'gray.300');

  return (
    <>
      {' '}
      <Flex
        direction={{ sm: 'column', md: 'row' }}
        mb='24px'
        maxH='330px'
        justifyContent={{ sm: 'center', md: 'space-between' }}
        align='center'
        backdropFilter='blur(21px)'
        boxShadow='0px 2px 5.5px rgba(0, 0, 0, 0.02)'
        border='1.5px solid'
        borderColor={borderProfileColor}
        bg={bgProfile}
        p='24px'
        borderRadius='20px'
      >
        <Flex
          align='center'
          mb={{ sm: '10px', md: '0px' }}
          direction={{ sm: 'column', md: 'row' }}
          w={{ sm: '100%' }}
          textAlign={{ sm: 'center', md: 'start' }}
        >
          <Avatar
            me={{ md: '22px' }}
            src={
              'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
            }
            w='80px'
            h='80px'
            borderRadius='15px'
          />
          <Flex direction='column' maxWidth='100%' my={{ sm: '14px' }}>
            <Text
              fontSize={{ sm: 'lg', lg: 'xl' }}
              color={textColor}
              fontWeight='bold'
              ms={{ sm: '8px', md: '0px' }}
            >
              Alec Thompson
            </Text>
            <Text
              fontSize={{ sm: 'sm', md: 'md' }}
              color={emailColor}
              fontWeight='semibold'
            >
              alec@simmmple.com
            </Text>
          </Flex>
        </Flex>
        <Flex
          direction={{ sm: 'column', lg: 'row' }}
          w={{ sm: '100%', md: '50%', lg: 'auto' }}
        >
          <Button p='0px' bg='transparent' variant='no-effects'>
            <Flex
              align='center'
              w={{ sm: '100%', lg: '135px' }}
              bg={colorMode === 'dark' ? 'navy.900' : '#fff'}
              borderRadius='8px'
              justifyContent='center'
              py='10px'
              boxShadow='0px 2px 5.5px rgba(0, 0, 0, 0.06)'
              cursor='pointer'
            >
              <Icon color={textColor} as={FaCube} me='6px' />
              <Text fontSize='xs' color={textColor} fontWeight='bold'>
                OVERVIEW
              </Text>
            </Flex>
          </Button>
        </Flex>
      </Flex>
      <CardComponent p='16px' my={{ sm: '24px', xl: '0px' }}>
        <CardHeader
          p='12px 5px'
          mb='12px'
          display='flex'
          justifyContent='space-between'
          alignItems='center'
        >
          <Text fontSize='lg' color={textColor} fontWeight='bold'>
            Thông tin hồ sơ
          </Text>
          <IconButton
            colorScheme='blue'
            aria-label='Search database'
            icon={<FaEdit />}
            onClick={() => setEditStatus(!editStatus)}
          />
        </CardHeader>
        <CardBody px='5px'>
          <Flex direction='column'>
            {!editStatus ? (
              <Text fontSize='md' color='gray.400' fontWeight='400' mb='30px'>
                Hi, I’m Esthera Jackson, Decisions: If you can’t decide, the
                answer is no. If two equally difficult paths, choose the one
                more painful in the short term (pain avoidance is creating an
                illusion of equality).
              </Text>
            ) : (
              <Textarea
                fontSize='md'
                fontWeight='400'
                mb='30px'
                cols={'50'}
                rows={'5'}
                value={`Hi, I’m Esthera Jackson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).`}
              />
            )}
            <Flex
              align='center'
              mb='18px'
              justifyContent={editStatus ? 'space-between' : 'flex-start'}
            >
              <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
                Full Name:
              </Text>
              {!editStatus ? (
                <Text fontSize='md' color='gray.400' fontWeight='400'>
                  Esthera Jackson
                </Text>
              ) : (
                <Input
                  fontSize='md'
                  fontWeight='400'
                  w='90%'
                  value={'Esthera Jackson'}
                />
              )}
            </Flex>
            <Flex
              align='center'
              mb='18px'
              justifyContent={editStatus ? 'space-between' : 'flex-start'}
            >
              <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
                Mobile:{' '}
              </Text>
              {!editStatus ? (
                <Text fontSize='md' color='gray.400' fontWeight='400'>
                  (44) 123 1234 123
                </Text>
              ) : (
                <Input
                  fontSize='md'
                  fontWeight='400'
                  w='90%'
                  value={'(44) 123 1234 123'}
                />
              )}
            </Flex>
            <Flex
              align='center'
              mb='18px'
              justifyContent={editStatus ? 'space-between' : 'flex-start'}
            >
              <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
                Email:{' '}
              </Text>
              {!editStatus ? (
                <Text fontSize='md' color='gray.400' fontWeight='400'>
                  esthera@simmmple.com
                </Text>
              ) : (
                <Input
                  fontSize='md'
                  fontWeight='400'
                  w='90%'
                  value={'esthera@simmmple.com'}
                />
              )}
            </Flex>
            <Flex
              align='center'
              mb='18px'
              justifyContent={editStatus ? 'space-between' : 'flex-start'}
            >
              <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
                Address:{' '}
              </Text>
              {!editStatus ? (
                <Text fontSize='md' color='gray.400' fontWeight='400'>
                  United States
                </Text>
              ) : (
                <Input
                  fontSize='md'
                  fontWeight='400'
                  w='90%'
                  value={'United States'}
                />
              )}
            </Flex>
            {!editStatus && (
              <Flex
                align='center'
                mb='18px'
                justifyContent={editStatus ? 'space-between' : 'flex-start'}
              >
                <Text
                  fontSize='md'
                  color={textColor}
                  fontWeight='bold'
                  me='10px'
                >
                  Social Media:{' '}
                </Text>
                <Flex>
                  <Link
                    href='#'
                    color={iconColor}
                    fontSize='lg'
                    me='10px'
                    _hover={{
                      color: 'blue.400',
                    }}
                  >
                    <Icon as={FaFacebook} />
                  </Link>
                  <Link
                    href='#'
                    color={iconColor}
                    fontSize='lg'
                    me='10px'
                    _hover={{
                      color: 'blue.400',
                    }}
                  >
                    <Icon as={FaInstagram} />
                  </Link>
                  <Link
                    href='#'
                    color={iconColor}
                    fontSize='lg'
                    me='10px'
                    _hover={{
                      color: 'blue.400',
                    }}
                  >
                    <Icon as={FaTwitter} />
                  </Link>
                </Flex>
              </Flex>
            )}
            {editStatus && (
              <Flex justifyContent={'flex-end'} mt={'20px'}>
                <Button
                  colorScheme='blue'
                  w={'10%'}
                  onClick={() => setEditStatus(!editStatus)}
                >
                  Save
                </Button>
              </Flex>
            )}
          </Flex>
        </CardBody>
      </CardComponent>
    </>
  );
}

export default ProfilePage;
