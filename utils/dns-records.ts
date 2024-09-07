#!/usr/bin/env -S deno run -A
import {program} from "commander";
import which from "https://esm.sh/which@4.0.0"
import * as path from "jsr:@std/path";
const gitRoot = path.fromFileUrl(new URL("..", import.meta.url).href)
const whereCli = path.resolve(which.sync("pipenv"))

let stderrLog: string
let stdoutLog: string

program.description("a Deno script to manage DNS records easily over octodns")

program.command("import")
  .aliases(["dump"])
  .description("Dump DNS records from")
  .argument("<domain>", "Domain name to extract DNS records from the provider API")
  .argument("[provider]", "DNS nameserver provider name", "cf")
  .action(async(domain: string, provider: string) => {
    const addTrailingDot = (domain: string) => {
      if (domain == "*") {
        return "'*'"
      } else {
        return `${domain}.`
      }
    }
    const args = [
      "run",
      "--", 
      "octodns-dump",
      "--config-file",
      `${gitRoot}dns/octodns-config.yml`,
      "--output-dir",
      `${gitRoot}dns`
    ]
    args.push(addTrailingDot(domain),`${provider || "cf"}`)
    console.log(`trying to exec ${whereCli} ${args.join(" ")}`)
    const ops = new Deno.Command(whereCli, {
      args,
      env: {
        "PIPENV_DONT_LOAD_ENV": "1"
      },
      stderr: "piped",
      stdout: "piped"
    }).spawn()
    const stdoutStreamReader = ops.stdout.pipeThrough(new TextDecoderStream()).getReader()
    const stderrStreamReader = ops.stderr.pipeThrough(new TextDecoderStream()).getReader()

    while (true) {
      const {value: stdoutData, done: stdoutDone} = await stdoutStreamReader.read()
      if (stdoutDone) break
      console.log(`stdout: ${stdoutData}`)
      stdoutLog += stdoutData
    }

    while (true) {
      const {value: stderrData, done: stderrDone} = await stderrStreamReader.read()
      if (stderrDone) break
      console.log(`stderr: ${stderrData}`)
      stderrLog += stderrData
    }

    if ((await ops.status).success != true) {
      console.error(`Run error with code ${(await ops.status).code}`)
      Deno.exit((await ops.status).code)
    }
  })

program.command("plan")
  .aliases(["dry-run","check", "validate", ])
  .action(async(opts) => {
    if (Deno.env.get("CLOUDFLARE_TOKEN") == undefined) {
      throw new Error("Cloudflare API token missing, maybe forgot to set DOTENV_PRIVATE_KEY?")
    }
    const args = ["run", "--", "octodns-sync", "--config-file", `${gitRoot}dns/octodns-config.yml`]
    console.log(`trying to exec ${whereCli} ${args.join(" ")}`)
    const ops = new Deno.Command(whereCli, {
      args,
      env: {
        "PIPENV_DONT_LOAD_ENV": "1"
      },
      stderr: "piped",
      stdout: "piped"
    }).spawn()
    const stdoutStreamReader = ops.stdout.pipeThrough(new TextDecoderStream()).getReader()
    const stderrStreamReader = ops.stderr.pipeThrough(new TextDecoderStream()).getReader()

    while (true) {
      const {value: stdoutData, done: stdoutDone} = await stdoutStreamReader.read()
      if (stdoutDone) break
      console.log(`stdout: ${stdoutData}`)
      stdoutLog += stdoutData
    }

    while (true) {
      const {value: stderrData, done: stderrDone} = await stderrStreamReader.read()
      if (stderrDone) break
      console.log(`stderr: ${stderrData}`)
      stderrLog += stderrData
    }

    if ((await ops.status).success != true) {
      console.error(`Run error with code ${(await ops.status).code}`)
      Deno.exit((await ops.status).code)
    }
  })

program.command("apply")
  .aliases(["deploy"])
  .description("Deploy DNS record changes")
  .option("-f, --force-apply, --force", "force apply to skip change threadshold checks in octodns")
  .action(async(opts) => {
    if (Deno.env.get("CLOUDFLARE_TOKEN") == undefined) {
      throw new Error("Cloudflare API token missing, maybe forgot to set DOTENV_PRIVATE_KEY?")
    }

    const args = ["run", "--", "octodns-sync", "--config-file", `${gitRoot}dns/octodns-config.yml`, "--doit"]

    if (opts.forceApply == true) {
      args.push("--force")
    }
    
    console.log(`trying to exec ${whereCli} ${args.join(" ")}`)
    const ops = new Deno.Command(whereCli, {
      args,
      env: {
        "PIPENV_DONT_LOAD_ENV": "1"
      },
      stderr: "piped",
      stdout: "piped"
    }).spawn()
    const stdoutStreamReader = ops.stdout.pipeThrough(new TextDecoderStream()).getReader()
    const stderrStreamReader = ops.stderr.pipeThrough(new TextDecoderStream()).getReader()

    while (true) {
      const {value: stdoutData, done: stdoutDone} = await stdoutStreamReader.read()
      if (stdoutDone) break
      console.log(`stdout: ${stdoutData}`)
      stdoutLog += stdoutData
    }

    while (true) {
      const {value: stderrData, done: stderrDone} = await stderrStreamReader.read()
      if (stderrDone) break
      console.log(`stderr: ${stderrData}`)
      stderrLog += stderrData
    }

    if ((await ops.status).success != true) {
      console.error(`Run error with code ${(await ops.status).code}`)
      Deno.exit((await ops.status).code)
    }
  })

program.parse()