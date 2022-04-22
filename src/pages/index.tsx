import { GetServerSideProps } from 'next'

const HomePage = () => {
  return <></>
}

export default HomePage

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: '/scoreboard/3/a/revisi',
      permanent: false,
    },
  }
}
