import React, {use, useState} from 'react'
import { Card, CardContent, CardHeader } from './ui/card';
import { Label } from './ui/label'
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react'
import { Checkbox } from './ui/checkbox'
import { userAuthStore } from '../store/store';
import { Link, useNavigate } from 'react-router-dom';

const AuthForm = ({type, userRole}) => {
  const [formData, setFormDate] = useState({
    name:"",
    email:"",
    password:""
  });

  const [showPassword, setShowPassword] = useState(false);

  const [agreeTerms, setAgreeTerms] = useState(false);

  const navigate = useNavigate()

  const handleOnSubmit = async (e)=>{
    e.preventDefault();
    if(isSignup && !agreeTerms) return
    try {
      if(type === 'signup'){
        if(userRole === 'doctor'){
          await registerDoctor({
            name: formData.name,
            email: formData.email,
            password: formData.password
          });
        }else{
          await registerPatient({
            name: formData.name,
            email: formData.email,
            password: formData.password
          });
        }
        navigate(`/onboarding/${userRole}`)
      }else{
        if(userRole === 'doctor'){
          await loginDoctor({
            email: formData.email,
            password: formData.password
          });
          navigate('/doctor/dashboard')
        }else{
          await loginPatient({
            email: formData.email,
            password: formData.password
          });
          navigate('/patient/dashboard')
        }
      }
    } catch (error) {
      
    }
  }



  const { 
    registerPatient, 
    registerDoctor, 
    loginPatient, 
    loginDoctor, 
    loading, 
    error ,
  } = userAuthStore();

  const isSignup = type == 'signup'
  const title = isSignup?"Create new Account":"Welcome back"
  const btnText = isSignup?"Signup":"Login"
  const altLinkText = isSignup?"Already a memeber ?":"Don't have an account ?"
  const altLinkAction = isSignup?"Signin":"Signup"
  const altLinkPath = isSignup ? `/login/${userRole}` : `/signup/${userRole}`;


  return (
    <div className='h-100vh w-100wh flex justify-center items-center'>
      <Card className='w-full md:max-w-md lg:max-wd-xl mx-auto p-2'>
        <CardContent className='p-2'>
          <h1 className='text-gray-600 font-bold text-2xl text-center'>{title}</h1>
          {error && (
            <div className='text-sm text-red-500 font-semibold p-1 mt-2'>
              {/* {error} */}
            </div>
          )}

          <form onSubmit={handleOnSubmit} className='space-y-4'>
            {/* //Name field for signup page only */}
            {isSignup && (
              <div className='space-y-2 text-md'>
                <Label htmlFor='name'>Full Name</Label>
                <Input
                  id='name'
                  type='text'
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e)=>setFormDate({...formData, name:e.target.value})}
                  className=''
                /> 
              </div>
            )}
            <div className='space-y-2 text-md'>
              <Label htmlFor='email'>Email</Label>
              <Input
              id='email'
              type='email'
              value={formData.email}
              placeholder="Enter email"
              onChange={(e)=>setFormDate({...formData, email:e.target.value})}
              />
            </div>
            

              <div className="space-y-2 text-md relative">
                <Label htmlFor="password">Password</Label>

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  placeholder="Enter password"
                  onChange={(e) =>
                    setFormDate({ ...formData, password: e.target.value })
                  }
                  className="pr-10"
                />

                  <Button
                    type="button"
                    variant="none"
                    size="icon"
                    className="absolute right-1 top-5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                  {showPassword ? <EyeOff /> : <Eye />}
                   </Button>
                  </div>

                  {isSignup &&( 
                  <div className='flex items-center gap-4'>
                    <Checkbox
                     id='terms'
                     value={agreeTerms}
                     onChange={()=>setAgreeTerms(!agreeTerms)}
                     />
                    <Label htmlFor='terms' className='font-normal'>Accept terms and conditions</Label>
                  </div>)
                  }
              <div>
                <Button
                type="submit"
                variant='none'
                className='w-full bg-black font-bold  text-white hover:bg-gray-600'
                >
                  {
                    btnText
                  }
                </Button>
              </div>
              <div className='text-center'>
                <p>{altLinkText} <Link to={altLinkPath} className='font-bold'>{altLinkAction}</Link></p>
              </div>
          </form>
        </CardContent>
      </Card>

    </div>
  )
}

export default AuthForm
