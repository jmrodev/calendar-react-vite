import { Main } from './main/main'
import { Aside } from './aside/aside'

const Content = () => {

    return (
        <div className='content'>
            <Aside />
            <Main />
        </div>
    )
}

export default Content