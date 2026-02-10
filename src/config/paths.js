import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const configDir = dirname(fileURLToPath(import.meta.url))
const srcDir = join(configDir, '..')
const viewsDir = join(srcDir, 'views')
const layoutsFile = join(viewsDir, 'layouts', 'default')
const errorsDir = join(viewsDir, 'errors')

export const paths = {
  srcDir,
  viewsDir,
  layoutsDir: layoutsFile,
  publicDir: join(srcDir, '..', 'public'),
  errors404File: join(errorsDir, '404.html'),
  errors403File: join(errorsDir, '403.html'),
  errors500File: join(errorsDir, '500.html')
}
