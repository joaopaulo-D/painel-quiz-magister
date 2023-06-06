import { Stack } from '@chakra-ui/react'
import { RiContactsBookLine, RiDashboardLine, RiGitMergeLine, RiInputMethodLine, RiCloseCircleLine } from 'react-icons/ri'
import { AiOutlineLogout } from "react-icons/ai"
import { MdQuiz } from "react-icons/md"

import { NavSection } from './NavSection'
import { NavLink } from './Navlink'

export function SidebarNav() {
  return (
    <Stack spacing="10" align="flex-start">

      <NavSection title="GERAL">
        <NavLink icon={RiDashboardLine} href="/dashboard">Dashboard</NavLink>
        <NavLink icon={MdQuiz} href="/question">Questões</NavLink>
        <NavLink icon={RiContactsBookLine} href="/users">Usuários</NavLink>
      </NavSection>

      <NavSection title="CLASSES">
        <NavLink icon={RiInputMethodLine} href="/discipline">Disciplinas</NavLink>
        <NavLink icon={RiInputMethodLine} href="/nature">Naturezas</NavLink>
      </NavSection>

      <NavSection title='AÇÕES'>
        <NavLink icon={AiOutlineLogout} href='/logout'>Sair</NavLink>
      </NavSection>
    </Stack>
  )
}