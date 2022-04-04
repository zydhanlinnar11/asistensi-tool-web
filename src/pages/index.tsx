import { GetServerSideProps } from 'next'

const HomePage = () => {
  return <></>
}

export default HomePage

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: '/scoreboard/1/a/revisi',
      permanent: false,
    },
  }
}
