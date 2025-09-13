import React from 'react'
import { Button } from 'semantic-ui-react'


export default function SignedOut(props) {
  return (
    <div>
        <Button onClick={props.signInPage} primary>Giriş Yap</Button>
        <Button primary onClick={props.registerJobSeeker} style={{marginLeft:'0.5em'}}>Kayıt Ol</Button>
    </div>
  )
}
