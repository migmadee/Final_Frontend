import { useState } from 'react'
import eventManger from '../../assets/EventManagement.png'
import { useAuthStore } from '../../store/useAuthStore'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../../components/ui/card'

const LogIn = () => {
  const navigate = useNavigate()
  const { loginUser, loading } = useAuthStore()

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await loginUser(formData)
      navigate('/')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Authentication failed'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className='flex flex-col lg:flex-row items-center justify-between w-full'>
      {/* Form Section */}
      <div className='w-full lg:w-1/2 px-6 py-12 flex justify-center'>
        <Card className='w-full max-w-md shadow-xl rounded-2xl p-6'>
          <CardHeader className='text-center'>
            <CardTitle className='text-3xl font-bold'>Welcome Back👋 </CardTitle>
            <CardDescription>Please enter your credentials to continue</CardDescription>
          </CardHeader>

          {!loading ? (
            <form onSubmit={handleSubmit}>
              <CardContent className='space-y-4'>
              

                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='Enter your email'
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='password'>Password</Label>
                  <Input
                    id='password'
                    type='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    placeholder='Enter your password'
                    required
                  />
                </div>

            
              </CardContent>

              <CardFooter className='flex flex-col gap-4'>
                <Button type='submit' className='w-full' disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className='animate-spin mr-2 h-4 w-4' />
                  ) : (
                    'LogIn'
                  )}
                </Button>

                <p className='text-center text-sm text-muted-foreground'>
                 Create a new account{' '}
                  <Link
                    to='/sign-up'
                    className='text-blue-600 hover:underline font-medium'
                  >
                    Sign Up
                  </Link>
                </p>
              </CardFooter>
            </form>
          ) : (
            <div className='flex justify-center py-8'>
              <Loader2 className='animate-spin text-blue-600' size={32} />
            </div>
          )}
        </Card>
      </div>

      {/* Image Section */}
      <section className='w-full lg:w-1/2 hidden lg:flex items-center justify-center p-4'>
        <img
          src={eventManger}
          alt='Event Management Illustration'
          className='object-contain max-h-[500px] rounded-xl shadow-lg'
          loading='lazy'
        />
      </section>
    </main>
  )
}

export default LogIn
