import React from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'

export default function RegisterChoose() {
  return (
    <div>
         <div>
         <Card.Group>
             <Card style={{ marginLeft:'30px',width:'400px', height:'400px' }}>
             <Image  src='https://idenfit.com/blog/wp-content/uploads/2020/01/yoA%CC%83a%CC%80neticide-bulunmas%C6%92%C2%B1-gereken-oA%CC%83a%CC%80zellikler@3x.png' wrapped ui={false} />
             <Card.Content>
               <Card.Header>İşveren Olarak</Card.Header>
               <Card.Header><a href="/auth/registeremployer">Kayıt Ol</a></Card.Header>
              </Card.Content>
             </Card>
             <Card style={{ width:'400px',height:'400px' }}>
             <Image src='https://www.socialbusinesstr.com/wp-content/uploads/2017/11/mutlu_calisanlar_-770x460.jpg' wrapped ui={false} />
             <Card.Content>
                <br/>
               <Card.Header>İş Arayan Olarak</Card.Header>
               <Card.Header><a href="/auth/registerjobseeker">Kayıt Ol</a></Card.Header>
              </Card.Content>
             </Card>
             </Card.Group>
        </div>
        </div>
  )
}
