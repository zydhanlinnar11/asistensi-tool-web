import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DetailSoal from '@/modules/asdos/types/soal/DetailSoal'
import { FC } from 'react'
import Link from 'next/link'

interface Props {
  soal: DetailSoal
}

const EditorialAlert: FC<Props> = ({ soal }) => {
  return (
    <div className="print:hidden">
      {!soal.isEditorialAvailable ? (
        <div
          className="flex gap-x-2 py-2 px-4 rounded-md
    text-red-500 bg-red-300/[0.15] mt-4"
        >
          <FontAwesomeIcon
            className="my-auto"
            icon={faCircleExclamation}
          ></FontAwesomeIcon>
          <p>Soal ini belum memiliki editorial, mohon menambahkan editorial</p>
        </div>
      ) : !soal.code || !soal.editorialHtml ? (
        <div
          className="flex gap-x-2 py-2 px-4 rounded-md
    text-red-500 bg-red-300/[0.15] mt-4"
        >
          <FontAwesomeIcon
            className="my-auto"
            icon={faCircleExclamation}
          ></FontAwesomeIcon>
          <p>
            Editorial sudah ada namun belum bisa diakses (mungkin praktikum
            belum selesai)
          </p>
        </div>
      ) : (
        <div
          className="flex gap-x-2 py-2 px-4 rounded-md
  text-green-500 bg-green-300/[0.15] mt-4"
        >
          <FontAwesomeIcon
            className="my-auto"
            icon={faCircleExclamation}
          ></FontAwesomeIcon>
          <p>
            Editorial sudah ada, anda dapat melihat PDF{' '}
            <Link
              href={`/asdos/praktikum/${soal.contestSlug}/${soal.slug}/preview-pdf`}
            >
              <a
                className='relative after:content-[""] after:h-[2px] after:w-full
            after:bottom-0 after:left-0 after:scale-x-0 after:absolute after:transform
            after:duration-300 hover:after:scale-x-100 after:bg-green-500'
              >
                <strong>disini</strong>
              </a>
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  )
}
export default EditorialAlert
